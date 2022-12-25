import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { haveNextPage } from 'src/modules/prisma/resolvers/pagination/pagination';
import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';
import {
  CommunityPostReactionsOrderList,
  ReactionInput,
} from '../../dto/reactions/reaction.input';
import { ReactionPayload } from '../../entities/reactions/reaction.payload';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { findManyCursorConnection } from 'src/modules/prisma/resolvers/pagination/relay.pagination';
import { ReactionsType } from '@prisma/client';

@Injectable()
export class ReactionRepository {
  constructor(private readonly prisma: PrismaService) {}
  public async getLikes(
    communityPostId: string,
    paginate: ConnectionArgs,
    order: CommunityPostReactionsOrderList,
  ) {
    const reactions = await findManyCursorConnection(
      (args) =>
        this.prisma.communityPostReaction.findMany({
          ...args,
          where: { communityPostId },
          orderBy: { [order.orderBy]: order.direction },
        }),
      () =>
        this.prisma.communityPostReaction.count({
          where: { communityPostId },
        }),
      { ...paginate },
    );
    return { data: reactions };
  }

  async getReactionCount(communityPostId: string) {
    return await this.prisma.communityPostReaction.count({
      where: { communityPostId },
    });
  }

  public async getLikesByType(
    communityPostId: string,
    reactionType: ReactionsType,
    paginate: ConnectionArgs,
    order: CommunityPostReactionsOrderList,
  ) {
    const reactions = await findManyCursorConnection(
      (args) =>
        this.prisma.communityPostReaction.findMany({
          ...args,
          where: { communityPostId, reactions: reactionType },
          orderBy: { [order.orderBy]: order.direction },
        }),
      () =>
        this.prisma.communityPostReaction.count({
          where: { communityPostId, reactions: reactionType },
        }),
      { ...paginate },
    );
    return { data: reactions };
  }
  public async removeLike(
    postId: string,
    userId: string,
    id: string,
  ): Promise<ReactionPayload> {
    try {
      const dislike = await this.prisma.communityPostReaction.delete({
        where: { id },
      });
      return {
        isDisliked: dislike ? true : false,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  public async create(
    input: ReactionInput,
    userId: string,
  ): Promise<ReactionPayload> {
    try {
      const reactions = await this.prisma.$transaction(async () => {
        const checkPostReaction =
          await this.prisma.communityPostReaction.findFirst({
            where: { communityPostId: input.postId, userId },
          });
        if (!checkPostReaction) {
          /**create likes(reactions) if doesnot exist*/
          const createReactions =
            await this.prisma.communityPostReaction.create({
              data: {
                communityPostId: input.postId,
                reactions: input.reactionType,
                userId,
              },
            });
          return { data: createReactions };
        }
        /**if post is already liked, remove it*/
        if (
          !checkPostReaction ||
          checkPostReaction.reactions === input.reactionType
        )
          return await this.removeLike(
            input.postId,
            userId,
            checkPostReaction.id,
          );
        /**update reaction if user changes the reactions */
        const updateReaction = await this.prisma.communityPostReaction.update({
          where: { id: checkPostReaction.id },
          data: { ...checkPostReaction, reactions: input.reactionType },
        });
        return { data: updateReaction };
      });
      return reactions;
    } catch (err) {
      throw new Error(err);
    }
  }
}
