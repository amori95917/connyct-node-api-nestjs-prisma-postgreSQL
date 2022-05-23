import { Injectable } from '@nestjs/common';
import { RatingStatus } from '@prisma/client';

import { CommentsRepository } from '../../comment/repository/comment.repository';
import { PostsRepository } from '../../post/repository/post.repository';

import { RatingRepository } from '../repository/rating.repository';

import type { RatePayload } from '../entities/rate.payload';

@Injectable()
export class RatingService {
  public constructor(
    private readonly ratingRepository: RatingRepository,
    private readonly commentsRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  private static getRatingIncrement(
    previousStatus: RatingStatus,
    newStatus: RatingStatus,
  ): number {
    const { UPVOTED, DOWNVOTED, NEUTRAL } = RatingStatus;

    if (previousStatus === UPVOTED && newStatus === DOWNVOTED) {
      return -2;
    }

    if (previousStatus === DOWNVOTED && newStatus === UPVOTED) {
      return 2;
    }

    if (
      (previousStatus === DOWNVOTED && newStatus === NEUTRAL) ||
      (previousStatus === NEUTRAL && newStatus === UPVOTED)
    ) {
      return 1;
    }

    return -1;
  }

  public async changePostRatingStatus(
    postId: string,
    userId: string,
    ratingStatus: RatingStatus,
  ): Promise<RatePayload> {
    const previousStatus = await this.ratingRepository.findPostRating(
      postId,
      userId,
    );
    if (previousStatus && previousStatus.rating === ratingStatus) {
      return {
        isRateSuccessful: true,
      };
    }
    if (previousStatus === null) {
      await this.changePostRating(postId, RatingStatus.NEUTRAL, ratingStatus);
    } else {
      await this.changePostRating(postId, previousStatus.rating, ratingStatus);
    }
    await this.ratingRepository.upsertPostRating(userId, postId, ratingStatus);
    return {
      isRateSuccessful: true,
    };
  }

  public async changeCommentRatingStatus(
    commentId: string,
    userId: string,
    ratingStatus: RatingStatus,
  ): Promise<RatePayload> {
    const previousStatus = await this.ratingRepository.findCommentRating(
      userId,
      commentId,
    );
    if (previousStatus && previousStatus.rating === ratingStatus) {
      return {
        isRateSuccessful: true,
      };
    }
    if (previousStatus === null) {
      await this.changeCommentRating(
        commentId,
        RatingStatus.NEUTRAL,
        ratingStatus,
      );
    } else {
      await this.changeCommentRating(
        commentId,
        previousStatus.rating,
        ratingStatus,
      );
    }
    await this.ratingRepository.upsertCommentRating(
      userId,
      commentId,
      ratingStatus,
    );
    return {
      isRateSuccessful: true,
    };
  }

  public async getMyPostRatingStatus(
    postId: string,
    userId: string,
  ): Promise<RatingStatus> {
    const rating = await this.ratingRepository.findPostRating(postId, userId);
    if (rating) {
      return rating.rating;
    }
    return RatingStatus.NEUTRAL;
  }

  public async getMyCommentRatingStatus(
    commentId: string,
    userId: string,
  ): Promise<RatingStatus> {
    const rating = await this.ratingRepository.findCommentRating(
      commentId,
      userId,
    );
    if (rating) {
      return rating.rating;
    }
    return RatingStatus.NEUTRAL;
  }

  private async changePostRating(
    postId: string,
    previousStatus: RatingStatus,
    newStatus: RatingStatus,
  ): Promise<void> {
    const incrementRating = RatingService.getRatingIncrement(
      previousStatus,
      newStatus,
    );

    await this.postsRepository.incrementRatingById(postId, incrementRating);
  }

  private async changeCommentRating(
    commentId: string,
    previousStatus: RatingStatus,
    newStatus: RatingStatus,
  ): Promise<void> {
    const incrementRating = RatingService.getRatingIncrement(
      previousStatus,
      newStatus,
    );

    await this.commentsRepository.incrementRatingById(
      commentId,
      incrementRating,
    );
  }
}
