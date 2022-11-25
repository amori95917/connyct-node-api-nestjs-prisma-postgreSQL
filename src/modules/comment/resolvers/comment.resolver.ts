import {
  CreateMentionsInput,
  OrderCommentsList,
} from './../dto/create-comment.input';
import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
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
import {
  CommentDeletePayload,
  NewReplyPayload,
} from '../entities/new-reply.payload';
import { UserService } from 'src/modules/user/services/user.service';
import { Replies, RepliesPagination } from '../../replies/replies.models';
import { CommentPaginationPayload } from '../entities/pagination.payload';
import { ReplyToCommentPayload } from 'src/modules/replies/entities/reply-to-comment.payload';

@Resolver(() => Comment)
export class CommentsResolver {
  public constructor(
    private readonly commentsService: CommentsService,
    private readonly commentsLoader: CommentsLoader,
    private readonly ratingService: RatingService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => NewReplyPayload)
  @UseGuards(GqlAuthGuard)
  public async commentToPost(
    @Args('postId', { type: () => String }) postId: string,
    @Args('input') input: CreateCommentInput,
    @Args('mention', { nullable: true }) mention: CreateMentionsInput,
    @CurrentUser() user: User,
  ): Promise<NewReplyPayload> {
    const userId = user.id;
    return this.commentsService.replyToPost(postId, userId, input, mention);
  }

  @ResolveField('mentions', () => [User])
  async getMentionsUser(@Parent() comment: Comment): Promise<User[]> {
    const { id } = comment;
    return await this.commentsService.getMentionsUser(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => NewReplyPayload)
  async commentUpdate(
    @Args('commentId') commentId: string,
    @Args('input') input: CreateCommentInput,
    @Args('mention', { nullable: true }) mention: CreateMentionsInput,
    @CurrentUser() user: User,
  ): Promise<NewReplyPayload> {
    return await this.commentsService.updateComment(
      commentId,
      input,
      mention,
      user.id,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CommentDeletePayload)
  async commentDelete(
    @Args('commentId') commentId: string,
    @CurrentUser() user: User,
  ): Promise<CommentDeletePayload> {
    return await this.commentsService.deleteComment(commentId, user.id);
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

  @ResolveField('creator', () => User)
  public async getCommentCreator(@Parent() comment: Comment): Promise<User> {
    const { creatorId } = comment;
    return this.commentsLoader.batchCreators.load(creatorId);
  }

  // @ResolveField('repliedTo', () => Comment)
  // public async repliedTo(@Parent() comment: Comment): Promise<Comment | null> {
  //   const { repliedToId } = comment;
  //   if (repliedToId !== null) {
  //     return this.commentsLoader.batchRepliedTo.load(repliedToId);
  //   }
  //   return null;
  // }

  @ResolveField('post', () => Post)
  public async post(@Parent() comment: Comment): Promise<Post | null> {
    const { postId } = comment;
    if (postId !== null) {
      return this.commentsLoader.batchPosts.load(postId);
    }
    return null;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => CommentPaginationPayload)
  async comments(
    @Args('postId', { type: () => String }) postId: string,
    // @Args('paginate', { nullable: true, defaultValue: { skip: 0, take: 50 } })
    // paginate: ConnectionArgs,
    @Args() paginate: ConnectionArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { orderBy: 'createdAt', direction: 'asc' },
    })
    order: OrderCommentsList,
  ) {
    return this.commentsService.getComments(postId, paginate, order);
  }

  @ResolveField('replies', () => RepliesPagination)
  public async replies(
    @Parent() comment: Comment,
    @Args() paginate: ConnectionArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { orderBy: 'createdAt', direction: 'asc' },
    })
    order: OrderCommentsList,
  ) {
    const { id } = comment;
    return this.commentsService.getRepliesToComment(id, paginate, order);
  }
}
