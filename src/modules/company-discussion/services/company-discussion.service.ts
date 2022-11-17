import { FollowCompanyService } from './../../follow-unfollow-company/services/follow-company.service';
import { Injectable } from '@nestjs/common';
import { customError } from 'src/common/errors';
import {
  COMPANY_CODE,
  COMPANY_DISCUSSION_CODE,
} from 'src/common/errors/error.code';
import {
  COMPANY_DISCUSSION_MESSAGE,
  COMPANY_MESSAGE,
} from 'src/common/errors/error.message';
import { STATUS_CODE } from 'src/common/errors/error.statusCode';
import { CompanyService } from 'src/modules/company/services/company.service';
import {
  CompanyDiscussionInput,
  CompanyDiscussionUpdateInput,
} from '../dto/company-discussion.inputs';
import {
  CompanyDiscussionDeletePayload,
  CompanyDiscussionPayload,
} from '../entities/company-discussion.payload';
import { CompanyDiscussionRepository } from '../repository/company-discussion.repository';
import {
  DiscussionAnswerDeletePayload,
  DiscussionAnswerPayload,
} from '../entities/discussion-answer.payload';
import {
  DiscussionAnswerInput,
  DiscussionAnswerUpdateInput,
  ReplyToAnswerInput,
} from '../dto/discussion-answer.input';
import { DiscussionVoteInput } from '../dto/discussion-vote.input';
import { DiscussionVotePayload } from '../entities/discussion-vote.payload';
import { DiscussionAnswerVotePayload } from '../entities/discussion-answer-vote.payload';
import { DiscussionAnswerVoteInput } from '../dto/discussion-answer-vote';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { OrderListDiscussion } from '../dto/order-discussion.input';
import { OrderListDiscussionAnswer } from '../dto/order-discussion-answer.input';

@Injectable()
export class CompanyDiscussionService {
  constructor(
    private readonly companyDiscussionRepository: CompanyDiscussionRepository,
    private readonly companyService: CompanyService,
    private readonly followCompanyService: FollowCompanyService,
  ) {}

  async find(
    companyId: string,
    paginate: ConnectionArgs,
    order: OrderListDiscussion,
  ) {
    return await this.companyDiscussionRepository.getDiscussionByCompanyId(
      companyId,
      paginate,
      order,
    );
  }
  async findByUserId(userId: string) {
    return await this.companyDiscussionRepository.getDiscussionByUserId(userId);
  }

  async createDiscussion(
    input: CompanyDiscussionInput,
    userId: string,
  ): Promise<CompanyDiscussionPayload> {
    try {
      const company = await this.companyService.getCompanyById(input.companyId);
      if (!company)
        return customError(
          COMPANY_MESSAGE.NOT_FOUND,
          COMPANY_CODE.NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );
      const followedCompany =
        await this.followCompanyService.checkIfUserFollowCompany(
          input.companyId,
          userId,
        );
      if (!followedCompany)
        return customError(
          COMPANY_DISCUSSION_MESSAGE.COMPANY_NOT_FOLLOWED,
          COMPANY_DISCUSSION_CODE.COMPANY_NOT_FOLLOWED,
          STATUS_CODE.BAD_CONFLICT,
        );
      return this.companyDiscussionRepository.createDiscussion(input, userId);
    } catch (err) {
      throw new Error(err);
    }
  }

  async update(
    input: CompanyDiscussionUpdateInput,
    id: string,
    userId: string,
  ): Promise<CompanyDiscussionPayload> {
    try {
      const discussion =
        await this.companyDiscussionRepository.getDiscussionAnswerByIdAndUserId(
          id,
          userId,
        );
      if (!discussion)
        return customError(
          COMPANY_DISCUSSION_MESSAGE.NOT_FOUND,
          COMPANY_DISCUSSION_CODE.NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );
      return await this.companyDiscussionRepository.update(input, id);
    } catch (err) {
      throw new Error(err);
    }
  }

  async delete(
    id: string,
    userId: string,
  ): Promise<CompanyDiscussionDeletePayload> {
    try {
      const discussion =
        await this.companyDiscussionRepository.getDiscussionAnswerByIdAndUserId(
          id,
          userId,
        );
      if (!discussion)
        return customError(
          COMPANY_DISCUSSION_MESSAGE.NOT_FOUND,
          COMPANY_DISCUSSION_CODE.NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );
      return await this.companyDiscussionRepository.delete(id);
    } catch (err) {
      throw new Error(err);
    }
  }

  async createVote(
    input: DiscussionVoteInput,
    userId: string,
  ): Promise<DiscussionVotePayload> {
    try {
      const discussion =
        await this.companyDiscussionRepository.getDiscussionById(
          input.discussionId,
        );
      if (!discussion)
        return customError(
          COMPANY_DISCUSSION_MESSAGE.NOT_FOUND,
          COMPANY_DISCUSSION_CODE.NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );
      return this.companyDiscussionRepository.createVote(input, userId);
    } catch (err) {
      throw new Error(err);
    }
  }

  async getDiscussionAnswer(
    discussionId: string,
    paginate: ConnectionArgs,
    order: OrderListDiscussionAnswer,
  ) {
    return await this.companyDiscussionRepository.getDiscussionAnswerByDiscussionId(
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
      const discussion =
        await this.companyDiscussionRepository.getDiscussionById(
          answer.discussionId,
        );
      if (!discussion)
        return customError(
          COMPANY_DISCUSSION_MESSAGE.NOT_FOUND,
          COMPANY_DISCUSSION_CODE.NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );
      return this.companyDiscussionRepository.createAnswer(answer, userId);
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
      const discussionAnswer =
        await this.companyDiscussionRepository.getDiscussionAnswerByIdAndUserId(
          id,
          userId,
        );
      if (!discussionAnswer)
        return customError(
          COMPANY_DISCUSSION_MESSAGE.DISCUSSION_ANSWER_NOT_FOUND,
          COMPANY_DISCUSSION_CODE.DISCUSSION_ANSWER_NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );
      return await this.companyDiscussionRepository.updateAnswer(
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
      const discussionAnswer =
        await this.companyDiscussionRepository.getDiscussionAnswerByIdAndUserId(
          id,
          userId,
        );
      if (!discussionAnswer)
        return customError(
          COMPANY_DISCUSSION_MESSAGE.DISCUSSION_ANSWER_NOT_FOUND,
          COMPANY_DISCUSSION_CODE.DISCUSSION_ANSWER_NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );
      return await this.companyDiscussionRepository.deleteAnswer(id);
    } catch (err) {
      throw new Error(err);
    }
  }

  async replyToAnswer(input: ReplyToAnswerInput, userId: string) {
    return await this.companyDiscussionRepository.replyToAnswer(input, userId);
  }

  async createAnswerVote(
    input: DiscussionAnswerVoteInput,
    userId: string,
  ): Promise<DiscussionAnswerVotePayload> {
    try {
      const discussion =
        await this.companyDiscussionRepository.getDiscussionAnswerById(
          input.discussionId,
        );
      if (!discussion)
        return customError(
          COMPANY_DISCUSSION_MESSAGE.DISCUSSION_ANSWER_NOT_FOUND,
          COMPANY_DISCUSSION_CODE.DISCUSSION_ANSWER_NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );
      return this.companyDiscussionRepository.createVote(input, userId);
    } catch (err) {
      throw new Error(err);
    }
  }
}
