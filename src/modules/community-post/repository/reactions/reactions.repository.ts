import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { haveNextPage } from 'src/modules/prisma/resolvers/pagination/pagination';
import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';
import {
  CommunityPostReactionsOrderList,
  ReactionInput,
} from '../../dto/reactions/reaction.input';
import { ReactionPayload } from '../../entities/reactions/reaction.payload';

@Injectable()
export class ReactionRepository {
  constructor(private readonly prisma: PrismaService) {}
  public async getLikes(
    communityPostId: string,
    paginate: PaginationArgs,
    order: CommunityPostReactionsOrderList,
  ) {
    /**fetch all the reactions from individual post along with users */
    const nodes = await this.prisma.communityPostReaction.findMany({
      where: { communityPostId },
      skip: paginate.skip,
      take: paginate.take,
      orderBy: { [order.orderBy]: order.direction },
      include: { user: true },
    });
    /**count all the reactions in individual post */
    const totalCount = await this.prisma.communityPostReaction.count({
      where: { communityPostId },
    });
    /**paginate next page or not */
    const hasNextPage = haveNextPage(paginate.skip, paginate.take, totalCount);
    return {
      nodes,
      totalCount,
      hasNextPage,
      edges: nodes?.map((node) => ({
        node,
        cursor: Buffer.from(node.id).toString('base64'),
      })),
    };
  }

  async getReactionCount(communityPostId: string) {
    return await this.prisma.communityPostReaction.count({
      where: { communityPostId },
    });
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
      const checkPostReaction =
        await this.prisma.communityPostReaction.findFirst({
          where: { communityPostId: input.postId, userId },
        });
      if (!checkPostReaction) {
        /**create likes(reactions) if doesnot exist*/
        const createReactions = await this.prisma.communityPostReaction.create({
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
      return {
        data: updateReaction,
      };
    } catch (err) {
      throw new Error(err);
    }
  }
}
