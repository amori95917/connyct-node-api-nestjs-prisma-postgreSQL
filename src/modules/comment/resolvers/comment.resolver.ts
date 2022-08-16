import { OrderCommentsList } from './../dto/create-comment.input';
import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';
import { UseGuards } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { Post } from '../../post/post.models';
import { RatePayload } from '../../rating/entities/rate.payload';
import { RatingStatus } from '../../rating/entities/rating-status.enum';
import { RatingService } from '../../rating/services/rating.service';
import { User } from '../../user/entities/user.entity';

import CommentsLoader from '../comment.loader';
import { Comment, CommentPagination } from '../comment.models';
import { CommentsService } from '../services/comment.service';
import { CreateCommentInput } from '../dto/create-comment.input';
import { NewReplyPayload } from '../entities/new-reply.payload';

@Resolver(() => Comment)
export class CommentsResolver {
  public constructor(
    private readonly commentsService: CommentsService,
    private readonly commentsLoader: CommentsLoader,
    private readonly ratingService: RatingService,
  ) {}

  @Mutation(() => NewReplyPayload)
  @UseGuards(GqlAuthGuard)
  public async replyToPost(
    @Args('postId', { type: () => String }) postId: string,
    @Args('input') input: CreateCommentInput,
    @CurrentUser() user: User,
  ): Promise<NewReplyPayload> {
    const userId = user.id;
    return this.commentsService.replyToPost(postId, userId, input);
  }

  @Mutation(() => NewReplyPayload)
  @UseGuards(GqlAuthGuard)
  public async replyToComment(
    @Args('commentId', { type: () => String }) commentId: string,
    @Args('input') input: CreateCommentInput,
    @CurrentUser() user: User,
  ): Promise<NewReplyPayload> {
    const userId = user.id;
    return this.commentsService.replyToComment(commentId, userId, input);
  }

  @Mutation(() => RatePayload)
  @UseGuards(GqlAuthGuard)
  public async upvoteComment(
    @Args('commentId', { type: () => String }) commentId: string,
    @CurrentUser() user: User,
  ): Promise<RatePayload> {
    const userId = user.id;
    return this.ratingService.changeCommentRatingStatus(
      commentId,
      userId,
      RatingStatus.UPVOTED,
    );
  }

  @Mutation(() => RatePayload)
  @UseGuards(GqlAuthGuard)
  public async downvoteComment(
    @Args('commentId', { type: () => String }) commentId: string,
    @CurrentUser() user: User,
  ): Promise<RatePayload> {
    const userId = user.id;
    return this.ratingService.changeCommentRatingStatus(
      commentId,
      userId,
      RatingStatus.DOWNVOTED,
    );
  }

  @Mutation(() => RatePayload)
  @UseGuards(GqlAuthGuard)
  public async removeRatingFromComment(
    @Args('commentId', { type: () => String }) commentId: string,
    @CurrentUser() user: User,
  ): Promise<RatePayload> {
    const userId = user.id;
    return this.ratingService.changeCommentRatingStatus(
      commentId,
      userId,
      RatingStatus.NEUTRAL,
    );
  }

  @ResolveField('myRatingStatus', () => RatingStatus)
  public async getMyRatingStatus(
    @Parent() comment: Comment,
    @CurrentUser() user: User | null,
  ): Promise<string> {
    if (user && Object.keys(user).length > 0) {
      const commentId = comment.id;
      const userId = user.id;
      return this.ratingService.getMyCommentRatingStatus(commentId, userId);
    }
    return RatingStatus.NEUTRAL;
  }

  @ResolveField('replies', () => [Comment])
  public async replies(@Parent() comment: Comment): Promise<Comment[]> {
    const { id } = comment;
    return this.commentsService.getRepliesToComment(id);
  }

  @ResolveField('creator', () => User)
  public async getCommentCreator(@Parent() comment: Comment): Promise<User> {
    const { creatorId } = comment;
    return this.commentsLoader.batchCreators.load(creatorId);
  }

  @ResolveField('repliedTo', () => Comment)
  public async repliedTo(@Parent() comment: Comment): Promise<Comment | null> {
    const { repliedToId } = comment;
    if (repliedToId !== null) {
      return this.commentsLoader.batchRepliedTo.load(repliedToId);
    }
    return null;
  }

  @ResolveField('post', () => Post)
  public async post(@Parent() comment: Comment): Promise<Post | null> {
    const { postId } = comment;
    if (postId !== null) {
      return this.commentsLoader.batchPosts.load(postId);
    }
    return null;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => CommentPagination)
  async getComments(
    @Args('postId', { type: () => String }) postId: string,
    @Args('paginate', { nullable: true, defaultValue: { skip: 0, take: 50 } })
    paginate: PaginationArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { order: 'createdAt', direction: 'asc' },
    })
    order: OrderCommentsList,
  ) {
    return this.commentsService.getComments(postId, paginate, order);
  }
}
