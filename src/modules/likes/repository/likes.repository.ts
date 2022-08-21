import { LikesInput, ReactionsOrderList } from './../dto/likes.inputs';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Likes } from '../likes.model';
import { Reactions } from '../entities/reactions.entity';
import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';
import { haveNextPage } from 'src/modules/prisma/resolvers/pagination/pagination';

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
      include: { user: true },
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
    reactionId: string,
    paginate: PaginationArgs,
    order: ReactionsOrderList,
  ) {
    try {
      /**fetch individual reaction from post along with user */
      const reactions = await this.prisma.postReaction.findMany({
        where: { reactionId: reactionId },
        skip: paginate.skip,
        take: paginate.take,
        orderBy: { [order.orderBy]: order.direction },
        include: { user: true },
      });
      /**checj if reaction exists */
      if (!reactions.length) throw new Error('Not found reaction');
      /**count individual reaction */
      const reactionsCount = await this.prisma.postReaction.count({
        where: { reactionId: reactionId },
      });
      /**paginate next page or not */
      const hasNextPage = haveNextPage(
        paginate.skip,
        paginate.take,
        reactionsCount,
      );

      return {
        nodes: reactions,
        totalCount: reactionsCount,
        hasNextPage,
        edges: reactions?.map((node) => ({
          node,
          cursor: Buffer.from(node.id).toString('base64'),
        })),
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  public async create(data: LikesInput, userId: string) {
    try {
      const checkLikes = await this.prisma.postReaction.findFirst({
        where: { postId: data.postId, userId },
      });
      /**check if post is already liked*/
      if (checkLikes) throw new Error('post already liked');
      /**check reaction */
      const checkReaction = await this.prisma.reactions.findFirst({
        where: { id: data.reactionId },
      });
      if (!checkReaction) throw new Error('Invalid reaction');
      /**create likes(reactions) */
      const likes = await this.prisma.postReaction.create({
        data: {
          postId: data.postId,
          reactionId: data.reactionId,
          userId: userId,
        },
      });
      return likes;
    } catch (err) {
      throw new Error(err);
    }
  }

  public async removeLike(postId: string, userId: string): Promise<Likes> {
    try {
      /**find reactions from postReactions who reacted(user) */
      const likes = await this.prisma.postReaction.findFirst({
        where: { postId: postId, userId: userId },
      });
      /**remove reaction */
      return await this.prisma.postReaction.delete({ where: { id: likes.id } });
    } catch (err) {
      throw new Error(err);
    }
  }
}
