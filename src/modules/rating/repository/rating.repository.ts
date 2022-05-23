import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/modules/prisma/prisma.service';

import type { CommentRating, PostRating, RatingStatus } from '@prisma/client';

@Injectable()
export class RatingRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async findPostRating(
    postId: string,
    userId: string,
  ): Promise<PostRating | null> {
    return this.prisma.postRating.findUnique({
      where: {
        UserAndPostIds: {
          postId,
          userId,
        },
      },
    });
  }

  public async findCommentRating(
    userId: string,
    commentId: string,
  ): Promise<CommentRating | null> {
    return this.prisma.commentRating.findUnique({
      where: {
        UserAndCommentIds: {
          commentId,
          userId,
        },
      },
    });
  }

  public async upsertCommentRating(
    userId: string,
    commentId: string,
    ratingStatus: RatingStatus,
  ): Promise<void> {
    await this.prisma.commentRating.upsert({
      create: {
        commentId,
        rating: ratingStatus,
        userId,
      },
      update: { rating: ratingStatus },
      where: { UserAndCommentIds: { commentId, userId } },
    });
  }

  public async upsertPostRating(
    userId: string,
    postId: string,
    ratingStatus: RatingStatus,
  ): Promise<void> {
    await this.prisma.postRating.upsert({
      create: {
        postId,
        rating: ratingStatus,
        userId,
      },
      update: { rating: ratingStatus },
      where: { UserAndPostIds: { postId, userId } },
    });
  }
}
