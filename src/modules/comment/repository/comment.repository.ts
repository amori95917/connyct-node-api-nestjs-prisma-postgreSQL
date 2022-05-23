import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/modules/prisma/prisma.service';
import type { Comment } from '@prisma/client';

@Injectable()
export class CommentsRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async createCommentToPost(
    creatorId: string,
    postId: string,
    text: string,
  ): Promise<Comment> {
    return this.prisma.comment.create({
      data: {
        creatorId,
        postId,
        text,
      },
    });
  }

  public async createCommentToComment(
    creatorId: string,
    commentId: string,
    text: string,
  ): Promise<Comment> {
    return this.prisma.comment.create({
      data: {
        creatorId,
        repliedToId: commentId,
        text,
      },
    });
  }

  public async findCommentsByPostId(postId: string): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: {
        postId,
      },
    });
  }

  public async findRepliesToComment(id: string): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: {
        repliedToId: id,
      },
    });
  }

  public async findCommentsByIds(keys: readonly string[]): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: {
        id: {
          in: [...keys],
        },
      },
    });
  }

  public async incrementRatingById(
    commentId: string,
    incrementRating: number,
  ): Promise<void> {
    await this.prisma.comment.update({
      data: {
        rating: {
          increment: incrementRating,
        },
      },
      where: {
        id: commentId,
      },
    });
  }
}
