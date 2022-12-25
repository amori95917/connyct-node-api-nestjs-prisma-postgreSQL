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
import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';
import {
  CommunityPostReactionsOrderList,
  ReactionInput,
} from '../../dto/reactions/reaction.input';
import { ReactionService } from '../../services/reactions/reactions.service';
import {
  CommunityPostReactionsPagination,
  Reaction,
} from '../../entities/reactions/reaction.entity';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import {
  ReactionPaginationPayload,
  ReactionPayload,
} from '../../entities/reactions/reaction.payload';
import { User } from 'src/modules/user/entities/user.entity';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { ReactionsType } from '@prisma/client';
import { CommunityPostLoader } from '../../community-post.loader';
import { ReactionTypeInput } from '../../dto/comment-reaction/comment-reaction.dto';

@Resolver(() => Reaction)
export class ReactionResolver {
  constructor(
    private readonly reactionService: ReactionService,
    private readonly communityPostLoader: CommunityPostLoader,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => ReactionPaginationPayload)
  async communityPostReaction(
    @Args('postId', { type: () => String }) postId: string,
    @Args() paginate: ConnectionArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { order: 'createdAt', direction: 'desc' },
    })
    order: CommunityPostReactionsOrderList,
  ) {
    return this.reactionService.getLikes(postId, paginate, order);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => ReactionPaginationPayload)
  async listByReactionType(
    @Args('postId', { type: () => String }) postId: string,
    @Args('reactionType') reactionType: ReactionTypeInput,
    @Args() paginate: ConnectionArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { order: 'createdAt', direction: 'desc' },
    })
    order: CommunityPostReactionsOrderList,
  ) {
    return this.reactionService.getLikesByType(
      postId,
      reactionType.reactionType,
      paginate,
      order,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ReactionPayload)
  async communityPostReactionCreate(
    @Args('data') data: ReactionInput,
    @CurrentUser() user: User,
  ): Promise<ReactionPayload> {
    return this.reactionService.create(data, user.id);
  }

  @ResolveField('reactor', () => User)
  async reactor(@Parent() reaction: Reaction): Promise<User> {
    const { userId } = reaction;
    return await this.communityPostLoader.creatorLoader.load(userId);
  }
}
