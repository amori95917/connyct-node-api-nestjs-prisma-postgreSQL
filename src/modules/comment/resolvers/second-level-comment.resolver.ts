import { CommentsRepository } from 'src/modules/comment/repository/comment.repository';
import { CommentsService } from 'src/modules/comment/services/comment.service';
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
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';
import { PostSecondLevelComment } from '../entities/second-level-comment.entity';
import {
  GetPostSecondLevelCommentPayload,
  PostSecondLevelCommentPayload,
} from '../entities/comment.payload';
import {
  PostCommentInput,
  PostMentionsInput,
  OrderCommentsList,
} from '../dto/create-comment.input';

@Resolver(() => PostSecondLevelComment)
export class SecondLevelCommentResolver {
  constructor(
    private readonly commentService: CommentsService,
    private readonly userService: UserService,
    private readonly commentRepository: CommentsRepository,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => PostSecondLevelCommentPayload)
  async createPostSecondLevelComment(
    @Args('commentId', { type: () => String }) commentId: string,
    @Args('input') input: PostCommentInput,
    @Args('mention', { nullable: true }) mention: PostMentionsInput,
    @CurrentUser() user: User,
  ): Promise<PostSecondLevelCommentPayload> {
    const userId = user.id;
    return this.commentService.secondLevelComment(
      commentId,
      userId,
      input,
      mention,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => GetPostSecondLevelCommentPayload)
  async getPostSecondLevelComments(
    @Args('commentId', { type: () => String }) commentId: string,
    @Args() paginate: ConnectionArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { orderBy: 'createdAt', direction: 'asc' },
    })
    order: OrderCommentsList,
  ): Promise<GetPostSecondLevelCommentPayload> {
    return this.commentService.getSecondLevelComment(
      commentId,
      paginate,
      order,
    );
  }

  //   @ResolveField('thirdLevelComment', () => ThirdLevelCommentPagination)
  //   async getReplies(
  //     @Parent() replies: SecondLevelComment,
  //     @Args() paginate: ConnectionArgs,
  //     @Args('order', {
  //       nullable: true,
  //       defaultValue: { orderBy: 'createdAt', direction: 'asc' },
  //     })
  //     order: OrderCommentList,
  //   ) {
  //     const { id } = replies;
  //     return await this.commentRepository.thirdLevelComment(id, paginate, order);
  //   }
  @ResolveField('creator', () => User)
  public async getCommentCreator(
    @Parent() comment: PostSecondLevelComment,
  ): Promise<User> {
    const { authorId } = comment;
    return this.userService.findUserById(authorId);
  }
}
