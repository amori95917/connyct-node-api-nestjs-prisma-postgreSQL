import { CommentsRepository } from './../../comment/repository/comment.repository';
import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Replies } from 'src/modules/replies/replies.models';
import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';
import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';
import {
  CreateCommentInput,
  CreateMentionsInput,
  OrderCommentsList,
} from 'src/modules/comment/dto/create-comment.input';
import {
  RepliesToReplies,
  RepliesToRepliesPagination,
} from '../replies-to-replies.model';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import { NewReplyPayload } from 'src/modules/comment/entities/new-reply.payload';
import { ReplyToCommentPayload } from '../entities/reply-to-comment.payload';
import { CommentsService } from 'src/modules/comment/services/comment.service';
import { Comment } from 'src/modules/comment/comment.models';
import { RepliesToRepliesPayload } from '../entities/reply-to-reply.payload';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';

@Resolver(() => Replies)
export class RepliesResolver {
  constructor(
    private readonly userService: UserService,
    private readonly commentRepository: CommentsRepository,
    private readonly commentsService: CommentsService,
  ) {}

  @Mutation(() => ReplyToCommentPayload)
  @UseGuards(GqlAuthGuard)
  public async commentReply(
    @Args('commentId', { type: () => String }) commentId: string,
    @Args('input') input: CreateCommentInput,
    @Args('mention', { nullable: true }) mention: CreateMentionsInput,
    @CurrentUser() user: User,
  ): Promise<NewReplyPayload> {
    const userId = user.id;
    return this.commentsService.replyToComment(
      commentId,
      userId,
      input,
      mention,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => RepliesToRepliesPayload)
  async replyToReply(
    @Args('commentId') commentId: string,
    @Args('input') input: CreateCommentInput,
    @Args('mention', { nullable: true }) mention: CreateMentionsInput,
    @CurrentUser() user: User,
  ) {
    return await this.commentsService.createReplyToReply(
      commentId,
      input,
      user.id,
      mention,
    );
  }

  @ResolveField('repliedTo', () => Comment)
  async replyTo(@Parent() replies: Replies): Promise<Comment> {
    const { repliedToCommentId } = replies;
    return await this.commentRepository.findCommentById(repliedToCommentId);
  }

  @ResolveField('replies', () => RepliesToRepliesPagination)
  async getReplies(
    @Parent() replies: Replies,
    @Args() paginate: ConnectionArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { orderBy: 'createdAt', direction: 'asc' },
    })
    order: OrderCommentsList,
  ) {
    const { id } = replies;
    return await this.commentRepository.findRepliesToComment(
      id,
      paginate,
      order,
    );
  }

  @ResolveField('creator', () => User)
  async getRepliesUser(@Parent() replies: Replies) {
    const { creatorId } = replies;
    return await this.userService.findUserById(creatorId);
  }
  @ResolveField('mentions', () => [User])
  async getMentionsUser(@Parent() replies: Replies) {
    const { id } = replies;
    return await this.commentRepository.getMentionsUser(id);
  }
}
