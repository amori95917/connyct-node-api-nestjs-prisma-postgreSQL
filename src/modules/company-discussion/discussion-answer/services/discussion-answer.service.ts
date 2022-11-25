import { Injectable } from '@nestjs/common';
import { customError } from 'src/common/errors';
import { COMPANY_DISCUSSION_CODE } from 'src/common/errors/error.code';
import { COMPANY_DISCUSSION_MESSAGE } from 'src/common/errors/error.message';
import { STATUS_CODE } from 'src/common/errors/error.statusCode';
import { FollowCompanyService } from 'src/modules/follow-unfollow-company/services/follow-company.service';
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

@Injectable()
export class DiscussionAnswerService {
  constructor(
    private readonly discussionAnswerRepository: DiscussionAnswerRepository,
    private readonly discussionRepository: CompanyDiscussionRepository,
    private readonly companyDiscussionRepository: CompanyDiscussionRepository,
    private readonly followCompanyService: FollowCompanyService,
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
        return customError(
          COMPANY_DISCUSSION_MESSAGE.NOT_FOUND,
          COMPANY_DISCUSSION_CODE.NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );
      const checkOwner = await this.companyDiscussionRepository.checkOwner(
        answer.discussionId,
        userId,
      );
      if (checkOwner)
        return this.discussionAnswerRepository.createAnswer(answer, userId);
      const followedCompany =
        await this.followCompanyService.checkIfUserFollowCompany(
          discussion.companyId,
          userId,
        );
      if (!followedCompany)
        return customError(
          COMPANY_DISCUSSION_MESSAGE.COMPANY_NOT_FOLLOWED,
          COMPANY_DISCUSSION_CODE.COMPANY_NOT_FOLLOWED,
          STATUS_CODE.BAD_CONFLICT,
        );
      return this.discussionAnswerRepository.createAnswer(answer, userId);
    } catch (err) {
      throw new Error(err);
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
        return customError(
          COMPANY_DISCUSSION_MESSAGE.DISCUSSION_ANSWER_NOT_FOUND,
          COMPANY_DISCUSSION_CODE.DISCUSSION_ANSWER_NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );
      const followedCompany =
        await this.followCompanyService.checkIfUserFollowCompany(
          discussionAnswer.discussion.companyId,
          userId,
        );
      if (!followedCompany)
        return customError(
          COMPANY_DISCUSSION_MESSAGE.COMPANY_NOT_FOLLOWED,
          COMPANY_DISCUSSION_CODE.COMPANY_NOT_FOLLOWED,
          STATUS_CODE.BAD_CONFLICT,
        );
      return await this.discussionAnswerRepository.updateAnswer(
        updateAnswer,
        id,
      );
    } catch (err) {
      throw new Error(err);
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
        return customError(
          COMPANY_DISCUSSION_MESSAGE.DISCUSSION_ANSWER_NOT_FOUND,
          COMPANY_DISCUSSION_CODE.DISCUSSION_ANSWER_NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );
      const followedCompany =
        await this.followCompanyService.checkIfUserFollowCompany(
          discussionAnswer.discussion.companyId,
          userId,
        );
      if (!followedCompany)
        return customError(
          COMPANY_DISCUSSION_MESSAGE.COMPANY_NOT_FOLLOWED,
          COMPANY_DISCUSSION_CODE.COMPANY_NOT_FOLLOWED,
          STATUS_CODE.BAD_CONFLICT,
        );
      return await this.discussionAnswerRepository.deleteAnswer(id);
    } catch (err) {
      throw new Error(err);
    }
  }

  async replyToAnswer(
    input: ReplyToAnswerInput,
    userId: string,
  ): Promise<DiscussionAnswerReplyPayload> {
    const answer =
      await this.discussionAnswerRepository.getDiscussionAnswerById(
        input.repliedToAnswerId,
      );
    if (!answer)
      return customError(
        COMPANY_DISCUSSION_MESSAGE.DISCUSSION_ANSWER_NOT_FOUND,
        COMPANY_DISCUSSION_CODE.DISCUSSION_ANSWER_NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    const checkOwner = await this.discussionAnswerRepository.checkOwner(
      input.repliedToAnswerId,
      userId,
    );
    if (checkOwner)
      return await this.discussionAnswerRepository.replyToAnswer(input, userId);
    const followedCompany =
      await this.followCompanyService.checkIfUserFollowCompany(
        answer.discussion.companyId,
        userId,
      );
    if (!followedCompany)
      return customError(
        COMPANY_DISCUSSION_MESSAGE.COMPANY_NOT_FOLLOWED,
        COMPANY_DISCUSSION_CODE.COMPANY_NOT_FOLLOWED,
        STATUS_CODE.BAD_CONFLICT,
      );
    return await this.discussionAnswerRepository.replyToAnswer(input, userId);
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
      console.log(discussionAnswer, 'incoming diss');
      if (!discussionAnswer)
        return customError(
          COMPANY_DISCUSSION_MESSAGE.DISCUSSION_ANSWER_NOT_FOUND,
          COMPANY_DISCUSSION_CODE.DISCUSSION_ANSWER_NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );
      const followedCompany =
        await this.followCompanyService.checkIfUserFollowCompany(
          discussionAnswer.discussion.companyId,
          userId,
        );
      if (!followedCompany)
        return customError(
          COMPANY_DISCUSSION_MESSAGE.COMPANY_NOT_FOLLOWED,
          COMPANY_DISCUSSION_CODE.COMPANY_NOT_FOLLOWED,
          STATUS_CODE.BAD_CONFLICT,
        );
      return this.discussionAnswerRepository.createAnswerVote(input, userId);
    } catch (err) {
      throw new Error(err);
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
        return customError(
          COMPANY_DISCUSSION_MESSAGE.DISCUSSION_ANSWER_NOT_FOUND,
          COMPANY_DISCUSSION_CODE.DISCUSSION_ANSWER_NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );
      const followedCompany =
        await this.followCompanyService.checkIfUserFollowCompany(
          discussionAnswer.discussion.companyId,
          userId,
        );
      if (!followedCompany)
        return customError(
          COMPANY_DISCUSSION_MESSAGE.COMPANY_NOT_FOLLOWED,
          COMPANY_DISCUSSION_CODE.COMPANY_NOT_FOLLOWED,
          STATUS_CODE.BAD_CONFLICT,
        );
      return this.discussionAnswerRepository.createAnswerDownvote(
        input,
        userId,
      );
    } catch (err) {
      throw new Error(err);
    }
  }
}
