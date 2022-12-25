import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  CommunityPostCommentReactionInput,
  CommunityPostCommentReactionsOrderList,
} from '../../dto/comment-reaction/comment-reaction.dto';
import { CommunityPostCommentReactionPayload } from '../../entities/comment-reaction/comment-reaction.payload';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { ReactionsType } from '@prisma/client';
import { findManyCursorConnection } from 'src/modules/prisma/resolvers/pagination/relay.pagination';

@Injectable()
export class CommunityPostCommentReactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async getReactions(
    communityPostCommentId: string,
    paginate: ConnectionArgs,
    order: CommunityPostCommentReactionsOrderList,
  ) {
    console.log(order, 'incoming order');
    const reactions = await findManyCursorConnection(
      (args) =>
        this.prisma.communityPostCommentReaction.findMany({
          ...args,
          where: { communityPostCommentId },
          orderBy: { [order.orderBy]: order.direction },
        }),
      () =>
        this.prisma.communityPostCommentReaction.count({
          where: { communityPostCommentId },
        }),
      { ...paginate },
    );
    return { data: reactions };
  }
  public async getLikesByType(
    communityPostCommentId: string,
    reactionType: ReactionsType,
    paginate: ConnectionArgs,
    order: CommunityPostCommentReactionsOrderList,
  ) {
    const reactions = await findManyCursorConnection(
      (args) =>
        this.prisma.communityPostCommentReaction.findMany({
          ...args,
          where: { communityPostCommentId, reactions: reactionType },
          orderBy: { [order.orderBy]: order.direction },
        }),
      () =>
        this.prisma.communityPostCommentReaction.count({
          where: { communityPostCommentId, reactions: reactionType },
        }),
      { ...paginate },
    );
    return { data: reactions };
  }

  async getReactionCount(communityPostCommentId: string) {
    return await this.prisma.communityPostCommentReaction.count({
      where: { communityPostCommentId },
    });
  }
  public async removeReaction(
    communityPostCommentId: string,
    userId: string,
  ): Promise<CommunityPostCommentReactionPayload> {
    try {
      /**find reactions from postReactions who reacted(user) */
      const likes = await this.prisma.communityPostCommentReaction.findFirst({
        where: { communityPostCommentId, userId },
      });
      /**remove reaction */
      await this.prisma.communityPostCommentReaction.delete({
        where: { id: likes.id },
      });
      return {
        isDisliked: true,
      };
    } catch (err) {
      throw new Error(err);
    }
  }
  async create(
    input: CommunityPostCommentReactionInput,
    userId: string,
  ): Promise<CommunityPostCommentReactionPayload> {
    try {
      const checkCommentReaction =
        await this.prisma.communityPostCommentReaction.findFirst({
          where: {
            communityPostCommentId: input.communityPostCommentId,
            userId,
          },
        });
      if (!checkCommentReaction) {
        /**create likes(reactions) if does not exist*/
        const createReaction =
          await this.prisma.communityPostCommentReaction.create({
            data: {
              communityPostCommentId: input.communityPostCommentId,
              userId,
              reactions: input.reactionType,
            },
          });
        return { data: createReaction };
      }
      /**if same reaction already exist, remove it*/
      if (
        !checkCommentReaction ||
        checkCommentReaction.reactions === input.reactionType
      )
        return await this.removeReaction(input.communityPostCommentId, userId);
      /**update reaction if user changes the reactions */
      // const updateReaction =
      //   await this.prisma.communityPostCommentReaction.update({
      //     where: { id: checkCommentReaction.id },
      //     data: { ...checkCommentReaction, reactions: input.reactionType },
      //   });
      // return {
      //   data: updateReaction,
      // };
    } catch (err) {
      throw new Error(err);
    }
  }
}
