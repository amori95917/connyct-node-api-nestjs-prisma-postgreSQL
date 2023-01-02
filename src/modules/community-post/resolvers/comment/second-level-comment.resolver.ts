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
import {
  CommentInput,
  MentionsInput,
  OrderCommentList,
} from '../../dto/comment/comment.input';
import { SecondLevelCommentPaginatedPayload } from '../../entities/comment/comment-pagination.payload';
import { SecondLevelCommentPayload } from '../../entities/comment/createComment.payload';
import { SecondLevelComment } from '../../entities/comment/second-level-comment.entity';
import { ThirdLevelCommentPagination } from '../../entities/comment/third-level-comment.entity';
import { CommentRepository } from '../../repository/comment/comment.repository';
import { CommentService } from '../../services/comment/comment.service';

@Resolver(() => SecondLevelComment)
export class SecondLevelCommentResolver {
  constructor(
    private readonly commentService: CommentService,
    private readonly userService: UserService,
    private readonly commentRepository: CommentRepository,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => SecondLevelCommentPayload)
  async createSecondLevelComment(
    @Args('commentId', { type: () => String }) commentId: string,
    @Args('input') input: CommentInput,
    @Args('mention', { nullable: true }) mention: MentionsInput,
    @CurrentUser() user: User,
  ): Promise<SecondLevelCommentPayload> {
    const userId = user.id;
    return this.commentService.secondLevelComment(
      commentId,
      userId,
      input,
      mention,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => SecondLevelCommentPaginatedPayload)
  async getSecondLevelComments(
    @Args('commentId', { type: () => String }) commentId: string,
    @Args() paginate: ConnectionArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { orderBy: 'createdAt', direction: 'asc' },
    })
    order: OrderCommentList,
  ): Promise<SecondLevelCommentPaginatedPayload> {
    return this.commentService.getSecondLevelComment(
      commentId,
      paginate,
      order,
    );
  }

  @ResolveField('thirdLevelComment', () => ThirdLevelCommentPagination)
  async getReplies(
    @Parent() replies: SecondLevelComment,
    @Args() paginate: ConnectionArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { orderBy: 'createdAt', direction: 'asc' },
    })
    order: OrderCommentList,
  ) {
    const { id } = replies;
    return await this.commentRepository.thirdLevelComment(id, paginate, order);
  }
  @ResolveField('creator', () => User)
  public async getCommentCreator(
    @Parent() comment: SecondLevelComment,
  ): Promise<User> {
    const { authorId } = comment;
    return this.userService.findUserById(authorId);
  }
}
