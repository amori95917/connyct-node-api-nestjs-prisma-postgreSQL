import { CommentsRepository } from 'src/modules/comment/repository/comment.repository';
import { GqlAuthGuard } from './../../auth/guards/gql-auth.guard';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  CommentReactionsInput,
  CommentReactionsOrderList,
} from '../dto/comment-reactions.input';
import {
  CommentReactionPaginationPayload,
  CommentReactionsPayload,
} from '../entities/comment-reaction.payload';
import { CommentReactionsService } from '../services/comment-reactions.service';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { User } from 'src/modules/user/entities/user.entity';
import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';
import { CommentReactions } from '../comment-reactions.model';
import { Post } from 'src/modules/post/post.models';

@Resolver(() => CommentReactions)
export class CommentReactionsResolver {
  constructor(
    private readonly commentReactionsService: CommentReactionsService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => CommentReactionPaginationPayload)
  async commentReactions(
    @Args('commentId', { type: () => String }) commentId: string,
    @Args('paginate', { nullable: true, defaultValue: { skip: 0, take: 50 } })
    paginate: PaginationArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { orderBy: 'createdAt', direction: 'asc' },
    })
    order: CommentReactionsOrderList,
  ) {
    return this.commentReactionsService.getComments(commentId, paginate, order);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CommentReactionsPayload)
  async commentReaction(
    @Args('input') input: CommentReactionsInput,
    @CurrentUser() user: User,
  ): Promise<CommentReactionsPayload> {
    return this.commentReactionsService.create(input, user.id);
  }
}
