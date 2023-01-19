import { Injectable } from '@nestjs/common';
import { customError } from 'src/common/errors';
import { COMPANY_DISCUSSION_CODE } from 'src/common/errors/error.code';
import { COMPANY_DISCUSSION_MESSAGE } from 'src/common/errors/error.message';
import { STATUS_CODE } from 'src/common/errors/error.statusCode';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { CompanyDiscussionRepository } from '../../discussion/repository/company-discussion.repository';
import { DiscussionAnswerVoteInput } from '../dto/discussion-answer-vote';
import {
  DiscussionAnswerInput,
  DiscussionAnswerUpdateInput,
  ReplyToAnswerInput,
} from '../dto/discussion-answer.input';
import { OrderListDiscussionAnswer } from '../dto/order-discussion-answer.input';
import { DiscussionAnswerVotePayload } from '../entities/discussion-answer-vote.payload';
import {
  DiscussionAnswerDeletePayload,
  DiscussionAnswerPayload,
  DiscussionAnswerReplyPayload,
} from '../entities/discussion-answer.payload';
import { DiscussionAnswerRepository } from '../repository/discussion-answer.repository';
import { ApolloError } from 'apollo-server-express';
import { FollowUnfollowRepository } from 'src/modules/follow-unfollow-company/repository/followUnfollow.repository';

@Injectable()
export class DiscussionAnswerService {
  constructor(
    private readonly discussionAnswerRepository: DiscussionAnswerRepository,
    private readonly discussionRepository: CompanyDiscussionRepository,
    private readonly companyDiscussionRepository: CompanyDiscussionRepository,
    private readonly followUnfollowRepository: FollowUnfollowRepository,
  ) {}
  async getDiscussionAnswer(
    discussionId: string,
    paginate: ConnectionArgs,
    order: OrderListDiscussionAnswer,
  ) {
    return await this.discussionAnswerRepository.getDiscussionAnswerByDiscussionId(
      discussionId,
      paginate,
      order,
    );
  }

  async createDiscussionAnswer(
    answer: DiscussionAnswerInput,
    userId: string,
  ): Promise<DiscussionAnswerPayload> {
    try {
      const discussion = await this.discussionRepository.getDiscussionById(
        answer.discussionId,
      );
      if (!discussion)
        throw new ApolloError(
          COMPANY_DISCUSSION_MESSAGE.NOT_FOUND,
          COMPANY_DISCUSSION_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      const checkOwner = await this.companyDiscussionRepository.checkOwner(
        answer.discussionId,
        userId,
      );
      if (checkOwner)
        return this.discussionAnswerRepository.createAnswer(answer, userId);
      const followedCompany =
        await this.followUnfollowRepository.checkIfUserFollowCompany(
          discussion.companyId,
          userId,
        );
      if (!followedCompany)
        throw new ApolloError(
          COMPANY_DISCUSSION_MESSAGE.COMPANY_NOT_FOLLOWED,
          COMPANY_DISCUSSION_CODE.COMPANY_NOT_FOLLOWED,
          { statusCode: STATUS_CODE.BAD_CONFLICT },
        );
      return this.discussionAnswerRepository.createAnswer(answer, userId);
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async updateAnswer(
    updateAnswer: DiscussionAnswerUpdateInput,
    id: string,
    userId: string,
  ): Promise<DiscussionAnswerPayload> {
    try {
      const checkOwner = await this.discussionAnswerRepository.checkOwner(
        id,
        userId,
      );
      if (checkOwner)
        return await this.discussionAnswerRepository.updateAnswer(
          updateAnswer,
          id,
        );
      const discussionAnswer =
        await this.discussionAnswerRepository.getDiscussionAnswerByIdAndUserId(
          id,
          userId,
        );
      if (!discussionAnswer)
        throw new ApolloError(
          COMPANY_DISCUSSION_MESSAGE.DISCUSSION_ANSWER_NOT_FOUND,
          COMPANY_DISCUSSION_CODE.DISCUSSION_ANSWER_NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      const followedCompany =
        await this.followUnfollowRepository.checkIfUserFollowCompany(
          discussionAnswer.discussion.companyId,
          userId,
        );
      if (!followedCompany)
        throw new ApolloError(
          COMPANY_DISCUSSION_MESSAGE.COMPANY_NOT_FOLLOWED,
          COMPANY_DISCUSSION_CODE.COMPANY_NOT_FOLLOWED,
          { statusCode: STATUS_CODE.BAD_CONFLICT },
        );
      return await this.discussionAnswerRepository.updateAnswer(
        updateAnswer,
        id,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async deleteAnswer(
    id: string,
    userId: string,
  ): Promise<DiscussionAnswerDeletePayload> {
    try {
      const checkOwner = await this.discussionAnswerRepository.checkOwner(
        id,
        userId,
      );
      if (checkOwner)
        return await this.discussionAnswerRepository.deleteAnswer(id);
      const discussionAnswer =
        await this.discussionAnswerRepository.getDiscussionAnswerByIdAndUserId(
          id,
          userId,
        );
      if (!discussionAnswer)
        throw new ApolloError(
          COMPANY_DISCUSSION_MESSAGE.DISCUSSION_ANSWER_NOT_FOUND,
          COMPANY_DISCUSSION_CODE.DISCUSSION_ANSWER_NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      const followedCompany =
        await this.followUnfollowRepository.checkIfUserFollowCompany(
          discussionAnswer.discussion.companyId,
          userId,
        );
      if (!followedCompany)
        throw new ApolloError(
          COMPANY_DISCUSSION_MESSAGE.COMPANY_NOT_FOLLOWED,
          COMPANY_DISCUSSION_CODE.COMPANY_NOT_FOLLOWED,
          { statusCode: STATUS_CODE.BAD_CONFLICT },
        );
      return await this.discussionAnswerRepository.deleteAnswer(id);
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async replyToAnswer(
    input: ReplyToAnswerInput,
    userId: string,
  ): Promise<DiscussionAnswerReplyPayload> {
    try {
      const answer =
        await this.discussionAnswerRepository.getDiscussionAnswerById(
          input.repliedToAnswerId,
        );
      if (!answer)
        throw new ApolloError(
          COMPANY_DISCUSSION_MESSAGE.DISCUSSION_ANSWER_NOT_FOUND,
          COMPANY_DISCUSSION_CODE.DISCUSSION_ANSWER_NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      const checkOwner = await this.discussionAnswerRepository.checkOwner(
        input.repliedToAnswerId,
        userId,
      );
      if (checkOwner)
        return await this.discussionAnswerRepository.replyToAnswer(
          input,
          userId,
        );
      const followedCompany =
        await this.followUnfollowRepository.checkIfUserFollowCompany(
          answer.discussion.companyId,
          userId,
        );
      if (!followedCompany)
        throw new ApolloError(
          COMPANY_DISCUSSION_MESSAGE.COMPANY_NOT_FOLLOWED,
          COMPANY_DISCUSSION_CODE.COMPANY_NOT_FOLLOWED,
          { statusCode: STATUS_CODE.BAD_CONFLICT },
        );
      return await this.discussionAnswerRepository.replyToAnswer(input, userId);
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async createAnswerVote(
    input: DiscussionAnswerVoteInput,
    userId: string,
  ): Promise<DiscussionAnswerVotePayload> {
    try {
      const checkOwner = await this.discussionAnswerRepository.checkOwner(
        input.discussionAnswerId,
        userId,
      );
      if (checkOwner)
        return this.discussionAnswerRepository.createAnswerVote(input, userId);

      const discussionAnswer =
        await this.discussionAnswerRepository.getDiscussionAnswerById(
          input.discussionAnswerId,
        );
      if (!discussionAnswer)
        throw new ApolloError(
          COMPANY_DISCUSSION_MESSAGE.DISCUSSION_ANSWER_NOT_FOUND,
          COMPANY_DISCUSSION_CODE.DISCUSSION_ANSWER_NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      const followedCompany =
        await this.followUnfollowRepository.checkIfUserFollowCompany(
          discussionAnswer.discussion.companyId,
          userId,
        );
      if (!followedCompany)
        throw new ApolloError(
          COMPANY_DISCUSSION_MESSAGE.COMPANY_NOT_FOLLOWED,
          COMPANY_DISCUSSION_CODE.COMPANY_NOT_FOLLOWED,
          { statusCode: STATUS_CODE.BAD_CONFLICT },
        );
      return this.discussionAnswerRepository.createAnswerVote(input, userId);
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
  async createAnswerDownvote(
    input: DiscussionAnswerVoteInput,
    userId: string,
  ): Promise<DiscussionAnswerVotePayload> {
    try {
      const checkOwner = await this.discussionAnswerRepository.checkOwner(
        input.discussionAnswerId,
        userId,
      );
      if (checkOwner)
        return this.discussionAnswerRepository.createAnswerVote(input, userId);

      const discussionAnswer =
        await this.discussionAnswerRepository.getDiscussionAnswerById(
          input.discussionId,
        );
      if (!discussionAnswer)
        throw new ApolloError(
          COMPANY_DISCUSSION_MESSAGE.DISCUSSION_ANSWER_NOT_FOUND,
          COMPANY_DISCUSSION_CODE.DISCUSSION_ANSWER_NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      const followedCompany =
        await this.followUnfollowRepository.checkIfUserFollowCompany(
          discussionAnswer.discussion.companyId,
          userId,
        );
      if (!followedCompany)
        throw new ApolloError(
          COMPANY_DISCUSSION_MESSAGE.COMPANY_NOT_FOLLOWED,
          COMPANY_DISCUSSION_CODE.COMPANY_NOT_FOLLOWED,
          { statusCode: STATUS_CODE.BAD_CONFLICT },
        );
      return this.discussionAnswerRepository.createAnswerDownvote(
        input,
        userId,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
}
