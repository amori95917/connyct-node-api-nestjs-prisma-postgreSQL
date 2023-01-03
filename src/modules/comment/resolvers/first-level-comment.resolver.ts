import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import {
  PostDeleteCommentPayload,
  PostFirstLevelCommentPayload,
  GetPostFirstLevelCommentPayload,
} from '../entities/comment.payload';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { User } from 'src/modules/user/entities/user.entity';
import { PostFirstLevelComment } from '../entities/first-level-comment.entity';
import { CommentsService } from '../services/comment.service';
import { UserService } from 'src/modules/user/services/user.service';
import { CommentsRepository } from '../repository/comment.repository';
import { PostsRepository } from 'src/modules/post/repository/post.repository';
import {
  PostCommentInput,
  PostMentionsInput,
  OrderCommentsList,
} from '../dto/create-comment.input';
import { Post } from 'src/modules/post/post.models';
import { PostSecondLevelCommentPagination } from '../entities/second-level-comment.entity';

@Resolver(() => PostFirstLevelComment)
export class FirstLevelCommentResolver {
  constructor(
    private readonly commentService: CommentsService,
    private readonly userService: UserService,
    private readonly commentRepository: CommentsRepository,
    private readonly postRepository: PostsRepository,
  ) {}

  @ResolveField('mentions', () => [User])
  async getMentionsUser(
    @Parent() comment: PostFirstLevelComment,
  ): Promise<User[]> {
    const { id } = comment;
    return await this.commentRepository.getMentionsUser(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => GetPostFirstLevelCommentPayload)
  async getPostsComments(
    @Args('postId', { type: () => String }) postId: string,
    @Args() paginate: ConnectionArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { orderBy: 'createdAt', direction: 'asc' },
    })
    order: OrderCommentsList,
  ): Promise<GetPostFirstLevelCommentPayload> {
    return this.commentService.getComments(postId, paginate, order);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => PostFirstLevelCommentPayload)
  async createPostFirstLevelComment(
    @Args('postId', { type: () => String }) postId: string,
    @Args('input') input: PostCommentInput,
    @Args('mention', { nullable: true }) mention: PostMentionsInput,
    @CurrentUser() user: User,
  ): Promise<PostFirstLevelCommentPayload> {
    const userId = user.id;
    return this.commentService.createFirstLevelComment(
      postId,
      userId,
      input,
      mention,
    );
  }
  @UseGuards(GqlAuthGuard)
  @Mutation(() => PostFirstLevelCommentPayload)
  async updatePostComment(
    @Args('commentId') commentId: string,
    @Args('input') input: PostCommentInput,
    @Args('mention', { nullable: true }) mention: PostMentionsInput,
    @CurrentUser() user: User,
  ): Promise<PostFirstLevelCommentPayload> {
    return await this.commentService.updateComment(
      commentId,
      input,
      mention,
      user.id,
    );
  }
  @Mutation(() => PostDeleteCommentPayload)
  async commentPostDelete(
    @Args('commentId') commentId: string,
    @CurrentUser() user: User,
  ): Promise<PostDeleteCommentPayload> {
    return await this.commentService.deleteComment(commentId, user.id);
  }

  @ResolveField('creator', () => User)
  public async getCommentCreator(
    @Parent() comment: PostFirstLevelComment,
  ): Promise<User> {
    const { authorId } = comment;
    return this.userService.findUserById(authorId);
  }

  @ResolveField('post', () => Post)
  public async post(
    @Parent() comment: PostFirstLevelComment,
  ): Promise<Post | null> {
    const { postId } = comment;
    return await this.postRepository.findPostById(postId);
  }

  @ResolveField('secondLevelComment', () => PostSecondLevelCommentPagination)
  public async replies(
    @Parent() comment: PostFirstLevelComment,
    @Args() paginate: ConnectionArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { orderBy: 'createdAt', direction: 'asc' },
    })
    order: OrderCommentsList,
  ) {
    const { id } = comment;
    return this.commentService.getSecondLevelComment(id, paginate, order);
  }

  @ResolveField('repliesCount', () => Number)
  public async repliesCount(
    @Parent() firstLevelComment: PostFirstLevelComment,
  ): Promise<number> {
    const { id } = firstLevelComment;
    return await this.commentRepository.getRepliesCount(id);
  }
}
