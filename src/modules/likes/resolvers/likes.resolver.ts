import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import { LikesInput } from './../dto/likes.inputs';
import { LikesService } from './../services/likes.services';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { User } from 'src/modules/user/entities/user.entity';
import { Likes } from '../likes.model';
import { LikesPayload } from '../entities/likes.payload';
import { Reactions } from '../entities/reactions.entity';

@Resolver()
export class LikesResolver {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [Reactions])
  async getReactions(): Promise<Reactions[]> {
    return this.likesService.getReactions();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => LikesPayload)
  async getLikesByPost(@Args('postId', { type: () => String }) postId: string) {
    return this.likesService.getLikes(postId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => LikesPayload)
  async getUsersByPostReaction(
    @Args('reactionId', { type: () => String }) reactionId: string,
  ) {
    return this.likesService.getUsersByPostReaction(reactionId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Likes)
  async createLikes(@Args('data') data: LikesInput, @CurrentUser() user: User) {
    return this.likesService.create(data, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Likes)
  async disLike(@Args('postId') postId: string, @CurrentUser() user: User) {
    return this.likesService.disLike(postId, user.id);
  }
}
