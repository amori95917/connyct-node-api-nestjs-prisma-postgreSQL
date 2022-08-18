import { LikesInput } from './../dto/likes.inputs';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Likes } from '../likes.model';
import { LikesPayload } from '../entities/likes.payload';
import { Reactions } from '../entities/reactions.entity';

@Injectable()
export class LikesRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async getReactions(): Promise<Reactions[]> {
    try {
      return await this.prisma.reactions.findMany();
    } catch (err) {
      throw new Error(err);
    }
  }

  public async getLikes(postId: string): Promise<LikesPayload> {
    const allLikes = await this.prisma.postReaction.findMany({
      where: { postId: postId },
      include: { user: true },
    });
    const totalCount = await this.prisma.postReaction.count({
      where: { postId },
    });

    return {
      likes: allLikes,
      count: totalCount,
      reactors: allLikes.map((reactor) => reactor.user),
    };
  }

  public async getUsersByPostReaction(
    reactionId: string,
  ): Promise<LikesPayload> {
    try {
      const reactions = await this.prisma.postReaction.findMany({
        where: { reactionId: reactionId },
        include: { user: true },
      });
      if (!reactions.length) throw new Error('Not found reaction');
      const reactionsCount = await this.prisma.postReaction.count({
        where: { reactionId: reactionId },
      });
      return {
        likes: reactions,
        count: reactionsCount,
        reactors: reactions.map((reactor) => reactor.user),
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  public async create(data: LikesInput, userId: string) {
    try {
      /*check if post is already liked*/
      const checkLikes = await this.prisma.postReaction.findFirst({
        where: { postId: data.postId, userId },
      });
      if (checkLikes) throw new Error('post already liked');
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

  public async disLike(postId: string, userId: string): Promise<Likes> {
    try {
      const likes = await this.prisma.postReaction.findFirst({
        where: { postId: postId, userId: userId },
      });
      return await this.prisma.postReaction.delete({ where: { id: likes.id } });
    } catch (err) {
      throw new Error(err);
    }
  }
}
