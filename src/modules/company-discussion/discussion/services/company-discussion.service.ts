import { FollowCompanyService } from '../../../follow-unfollow-company/services/follow-company.service';
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

import { DiscussionVoteInput } from '../dto/discussion-vote.input';
import { DiscussionVotePayload } from '../../discussion-answer/entities/discussion-vote.payload';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { OrderListDiscussion } from '../dto/order-discussion.input';

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
      console.log('input', input);
      const company = await this.companyService.getCompanyById(input.companyId);
      console.log('company', company);
      if (!company) {
        // if its not from a company account then it might be from followed user
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
        else {
          return this.companyDiscussionRepository.createDiscussion(
            input,
            userId,
          );
        }
      } else {
        // if its from a company user then allow to create a discussion
        return this.companyDiscussionRepository.createDiscussion(input, userId);
      }
      // return customError(
      //   COMPANY_MESSAGE.NOT_FOUND,
      //   COMPANY_CODE.NOT_FOUND,
      //   STATUS_CODE.NOT_FOUND,
      // );
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
        await this.companyDiscussionRepository.getDiscussionByIdAndUserId(
          id,
          userId,
        );
      if (!discussion)
        return customError(
          COMPANY_DISCUSSION_MESSAGE.NOT_FOUND,
          COMPANY_DISCUSSION_CODE.NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );
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
      const checkOwner = await this.companyDiscussionRepository.checkOwner(
        id,
        userId,
      );
      if (checkOwner) return await this.companyDiscussionRepository.delete(id);
      const discussion =
        await this.companyDiscussionRepository.getDiscussionByIdAndUserId(
          id,
          userId,
        );
      if (!discussion)
        return customError(
          COMPANY_DISCUSSION_MESSAGE.NOT_FOUND,
          COMPANY_DISCUSSION_CODE.NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );
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
      return await this.companyDiscussionRepository.delete(id);
    } catch (err) {
      throw new Error(err);
    }
  }

  async countVote(id: string) {
    return await this.companyDiscussionRepository.countVote(id);
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
      return this.companyDiscussionRepository.createVote(input, userId);
    } catch (err) {
      throw new Error(err);
    }
  }
  async downVote(
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
      return this.companyDiscussionRepository.downVote(input, userId);
    } catch (err) {
      throw new Error(err);
    }
  }
}
