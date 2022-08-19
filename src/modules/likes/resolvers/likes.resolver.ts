import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import { LikesInput, ReactionsOrderList } from './../dto/likes.inputs';
import { LikesService } from './../services/likes.services';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { User } from 'src/modules/user/entities/user.entity';
import { Likes, ReactionsPagination } from '../likes.model';
import { LikesPayload } from '../entities/likes.payload';
import { Reactions } from '../entities/reactions.entity';
import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';

@Resolver()
export class LikesResolver {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [Reactions])
  async getReactions(): Promise<Reactions[]> {
    return this.likesService.getReactions();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => ReactionsPagination)
  async getLikesByPost(
    @Args('postId', { type: () => String }) postId: string,
    @Args('paginate', { nullable: true, defaultValue: { skip: 0, take: 50 } })
    paginate: PaginationArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { order: 'createdAt', direction: 'desc' },
    })
    order: ReactionsOrderList,
  ) {
    return this.likesService.getLikes(postId, paginate, order);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => ReactionsPagination)
  async getUsersByPostReaction(
    @Args('reactionId', { type: () => String }) reactionId: string,
    @Args('paginate', { nullable: true, defaultValue: { skip: 0, take: 50 } })
    paginate: PaginationArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { order: 'createdAt', direction: 'desc' },
    })
    order: ReactionsOrderList,
  ) {
    return this.likesService.getUsersByPostReaction(
      reactionId,
      paginate,
      order,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Likes)
  async createLikes(@Args('data') data: LikesInput, @CurrentUser() user: User) {
    return this.likesService.create(data, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Likes)
  async removeLike(@Args('postId') postId: string, @CurrentUser() user: User) {
    return this.likesService.removeLike(postId, user.id);
  }
}
