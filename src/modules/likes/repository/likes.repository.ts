import { LikesInput, ReactionsOrderList } from './../dto/likes.inputs';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Likes } from '../likes.model';
import { Reactions } from '../entities/reactions.entity';
import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';
import { haveNextPage } from 'src/modules/prisma/resolvers/pagination/pagination';
import { LikesPayload } from '../entities/likes.payload';
@Injectable()
export class LikesRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async getReactions(): Promise<Reactions[]> {
    try {
      /**fetch all the reactions from reactions table */
      return await this.prisma.reactions.findMany();
    } catch (err) {
      throw new Error(err);
    }
  }

  public async getLikes(
    postId: string,
    paginate: PaginationArgs,
    order: ReactionsOrderList,
  ) {
    /**fetch all the reactions from individual post along with users */
    const nodes = await this.prisma.postReaction.findMany({
      where: { postId: postId },
      skip: paginate.skip,
      take: paginate.take,
      orderBy: { [order.orderBy]: order.direction },
      include: { user: true, reactions: true },
    });
    /**count all the reactions in individual post */
    const totalCount = await this.prisma.postReaction.count({
      where: { postId },
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

  public async getUsersByPostReaction(
    reactionType: string,
    paginate: PaginationArgs,
    order: ReactionsOrderList,
  ) {
    try {
      const reaction = await this.prisma.reactions.findUnique({
        where: { reactionType: reactionType },
      });
      /**fetch individual reaction from post along with user */
      const allReactions = await this.prisma.postReaction.findMany({
        where: { reactionId: reaction.id },
        skip: paginate.skip,
        take: paginate.take,
        orderBy: { [order.orderBy]: order.direction },
        include: { user: true, reactions: true },
      });
      /**checj if reaction exists */
      if (!allReactions.length) throw new Error('Reactions not found');
      /**count individual reaction */
      const reactionsCount = await this.prisma.postReaction.count({
        where: { reactionId: reaction.id },
      });
      /**paginate next page or not */
      const hasNextPage = haveNextPage(
        paginate.skip,
        paginate.take,
        reactionsCount,
      );

      return {
        nodes: allReactions,
        totalCount: reactionsCount,
        hasNextPage,
        edges: allReactions?.map((node) => ({
          node,
          cursor: Buffer.from(node.id).toString('base64'),
        })),
      };
    } catch (err) {
      throw new Error(err);
    }
  }
  public async removeLike(
    postId: string,
    userId: string,
  ): Promise<LikesPayload> {
    try {
      /**find reactions from postReactions who reacted(user) */
      const likes = await this.prisma.postReaction.findFirst({
        where: { postId: postId, userId: userId },
      });
      /**remove reaction */
      await this.prisma.postReaction.delete({
        where: { id: likes.id },
      });
      return {
        isDisliked: true,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  public async create(data: LikesInput, userId: string): Promise<LikesPayload> {
    try {
      const checkPostReaction = await this.prisma.postReaction.findFirst({
        where: { postId: data.postId, userId },
      });
      /**check reaction exists or not*/
      const checkReaction = await this.prisma.reactions.findFirst({
        where: { reactionType: data.reactionType },
      });
      if (!checkReaction) throw new Error('Invalid reactions');
      if (!checkPostReaction) {
        /**create likes(reactions) if doesnot exist*/
        const createLike = await this.prisma.postReaction.create({
          data: {
            postId: data.postId,
            reactionId: checkReaction.id,
            userId: userId,
          },
        });
        return { likes: createLike };
      }
      /**if post is already liked, remove it*/
      if (
        !checkPostReaction ||
        checkPostReaction.reactionId === checkReaction.id
      )
        return await this.removeLike(data.postId, userId);
      /**update reaction if user changes the reactions */
      const updateLikes = await this.prisma.postReaction.update({
        where: { id: checkPostReaction.id },
        data: { ...checkPostReaction, reactionId: checkReaction.id },
      });
      return {
        likes: updateLikes,
      };
    } catch (err) {
      throw new Error(err);
    }
  }
}
