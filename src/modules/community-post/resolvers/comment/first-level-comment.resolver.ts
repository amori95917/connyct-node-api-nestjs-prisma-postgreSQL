import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import { CommentRepository } from 'src/modules/community-post/repository/comment/comment.repository';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';
import {
  CommentInput,
  MentionsInput,
  OrderCommentList,
} from '../../dto/comment/comment.input';
import { FirstLevelCommentPaginatedPayload } from '../../entities/comment/comment-pagination.payload';
import { FirstLevelCommentPayload } from '../../entities/comment/createComment.payload';
import { DeleteCommentPayload } from '../../entities/comment/delete-comment.payload';
import {
  FirstLevelComment,
  FirstLevelCommentPagination,
} from '../../entities/comment/first-level-comment.entity';
import { SecondLevelCommentPagination } from '../../entities/comment/second-level-comment.entity';
import { CommunityPost } from '../../entities/post/community-post.entity';
import { CommunityPostRepository } from '../../repository/post/community-post.repository';
import { CommentService } from '../../services/comment/comment.service';

@Resolver(() => FirstLevelComment)
export class FirstLevelCommentResolver {
  constructor(
    private readonly commentService: CommentService,
    private readonly userService: UserService,
    private readonly commentRepository: CommentRepository,
    private readonly communityPostRepository: CommunityPostRepository,
  ) {}

  @ResolveField('mentions', () => [User])
  async getMentionsUser(@Parent() comment: FirstLevelComment): Promise<User[]> {
    const { id } = comment;
    return await this.commentRepository.getMentionsUser(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => FirstLevelCommentPaginatedPayload)
  async getComments(
    @Args('postId', { type: () => String }) postId: string,
    @Args() paginate: ConnectionArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { orderBy: 'createdAt', direction: 'asc' },
    })
    order: OrderCommentList,
  ): Promise<FirstLevelCommentPaginatedPayload> {
    return this.commentService.getComments(postId, paginate, order);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => FirstLevelCommentPayload)
  async createFirstLevelComment(
    @Args('postId', { type: () => String }) postId: string,
    @Args('input') input: CommentInput,
    @Args('mention', { nullable: true }) mention: MentionsInput,
    @CurrentUser() user: User,
  ): Promise<FirstLevelCommentPayload> {
    const userId = user.id;
    return this.commentService.createFirstLevelComment(
      postId,
      userId,
      input,
      mention,
    );
  }
  @UseGuards(GqlAuthGuard)
  @Mutation(() => FirstLevelCommentPayload)
  async updateComment(
    @Args('commentId') commentId: string,
    @Args('input') input: CommentInput,
    @Args('mention', { nullable: true }) mention: MentionsInput,
    @CurrentUser() user: User,
  ): Promise<FirstLevelCommentPayload> {
    return await this.commentService.updateComment(
      commentId,
      input,
      mention,
      user.id,
    );
  }
  @Mutation(() => DeleteCommentPayload)
  async commentDelete(
    @Args('commentId') commentId: string,
    @CurrentUser() user: User,
  ): Promise<DeleteCommentPayload> {
    return await this.commentService.deleteComment(commentId, user.id);
  }

  @ResolveField('creator', () => User)
  public async getCommentCreator(
    @Parent() comment: FirstLevelComment,
  ): Promise<User> {
    const { authorId } = comment;
    return this.userService.findUserById(authorId);
  }

  @ResolveField('communityPost', () => CommunityPost)
  public async communityPost(
    @Parent() comment: FirstLevelComment,
  ): Promise<CommunityPost | null> {
    const { communityPostId } = comment;
    return await this.communityPostRepository.findPostById(communityPostId);
  }

  @ResolveField('secondLevelComment', () => SecondLevelCommentPagination)
  public async replies(
    @Parent() comment: FirstLevelComment,
    @Args() paginate: ConnectionArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { orderBy: 'createdAt', direction: 'asc' },
    })
    order: OrderCommentList,
  ) {
    const { id } = comment;
    return this.commentService.getSecondLevelComment(id, paginate, order);
  }

  @ResolveField('repliesCount', () => Number)
  public async repliesCount(
    @Parent() firstLevelComment: FirstLevelComment,
  ): Promise<number> {
    const { id } = firstLevelComment;
    return await this.commentRepository.getRepliesCount(id);
  }
}
