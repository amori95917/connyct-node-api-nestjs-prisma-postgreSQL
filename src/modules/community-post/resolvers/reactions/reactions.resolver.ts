import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';
import {
  CommunityPostReactionsOrderList,
  ReactionInput,
} from '../../dto/reactions/reaction.input';
import { ReactionService } from '../../services/reactions/reactions.service';
import { CommunityPostReactionsPagination } from '../../entities/reactions/reaction.entity';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { ReactionPayload } from '../../entities/reactions/reaction.payload';
import { User } from 'src/modules/user/entities/user.entity';

@Resolver()
export class ReactionResolver {
  constructor(private readonly reactionService: ReactionService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => CommunityPostReactionsPagination)
  async communityPostReaction(
    @Args('postId', { type: () => String }) postId: string,
    @Args('paginate', { nullable: true, defaultValue: { skip: 0, take: 50 } })
    paginate: PaginationArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { order: 'createdAt', direction: 'desc' },
    })
    order: CommunityPostReactionsOrderList,
  ) {
    return this.reactionService.getLikes(postId, paginate, order);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ReactionPayload)
  async communityPostReactionCreate(
    @Args('data') data: ReactionInput,
    @CurrentUser() user: User,
  ): Promise<ReactionPayload> {
    return this.reactionService.create(data, user.id);
  }
}
