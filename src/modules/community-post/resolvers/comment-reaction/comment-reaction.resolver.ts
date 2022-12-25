import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CommunityPostCommentReactionService } from '../../services/comment-reaction/comment-reaction.service';
import { CommunityPostCommentReaction } from '../../entities/comment-reaction/comment-reaction.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import {
  CommunityPostCommentReactionPaginationPayload,
  CommunityPostCommentReactionPayload,
} from '../../entities/comment-reaction/comment-reaction.payload';
import {
  CommunityPostCommentReactionInput,
  CommunityPostCommentReactionsOrderList,
  ReactionTypeInput,
} from '../../dto/comment-reaction/comment-reaction.dto';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { User } from 'src/modules/user/entities/user.entity';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { ReactionsType } from '@prisma/client';
import { CommunityPostLoader } from '../../community-post.loader';

@Resolver(() => CommunityPostCommentReaction)
export class CommunityPostCommentReactionResolver {
  constructor(
    private readonly communityPostCommentReactionService: CommunityPostCommentReactionService,
    private readonly communityPostLoader: CommunityPostLoader,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => CommunityPostCommentReactionPaginationPayload)
  async communityPostCommentReaction(
    @Args('communityPostCommentId', { type: () => String })
    communityPostCommentId: string,
    @Args() paginate: ConnectionArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { order: 'createdAt', direction: 'desc' },
    })
    order: CommunityPostCommentReactionsOrderList,
  ) {
    return this.communityPostCommentReactionService.getReactions(
      communityPostCommentId,
      paginate,
      order,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => CommunityPostCommentReactionPaginationPayload)
  async listCommentByReactionType(
    @Args('communityPostCommentId', { type: () => String })
    communityPostCommentId: string,
    @Args('reactionType') reactionType: ReactionTypeInput,
    @Args() paginate: ConnectionArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { order: 'createdAt', direction: 'desc' },
    })
    order: CommunityPostCommentReactionsOrderList,
  ) {
    return this.communityPostCommentReactionService.getLikesByType(
      communityPostCommentId,
      reactionType.reactionType,
      paginate,
      order,
    );
  }
  @UseGuards(GqlAuthGuard)
  @Mutation(() => CommunityPostCommentReactionPayload)
  async communityPostCommentReactionCreate(
    @Args('input') input: CommunityPostCommentReactionInput,
    @CurrentUser() user: User,
  ): Promise<CommunityPostCommentReactionPayload> {
    return await this.communityPostCommentReactionService.create(
      input,
      user.id,
    );
  }

  @ResolveField('reactor', () => User)
  async reactor(
    @Parent() reaction: CommunityPostCommentReaction,
  ): Promise<User> {
    const { userId } = reaction;
    return await this.communityPostLoader.creatorLoader.load(userId);
  }
}
