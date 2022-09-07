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
  OrderCommentsList,
} from 'src/modules/comment/dto/create-comment.input';
import { RepliesToRepliesPagination } from '../replies-to-replies.model';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import { NewReplyPayload } from 'src/modules/comment/entities/new-reply.payload';

@Resolver(() => Replies)
export class RepliesResolver {
  constructor(
    private readonly userService: UserService,
    private readonly commentRepository: CommentsRepository,
  ) {}

  @ResolveField('replies', () => RepliesToRepliesPagination)
  async getReplies(
    @Parent() replies: Replies,
    @Args('paginate', { nullable: true, defaultValue: { skip: 0, take: 50 } })
    paginate: PaginationArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { order: 'createdAt', direction: 'asc' },
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
