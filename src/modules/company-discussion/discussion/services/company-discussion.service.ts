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
import { ApolloError } from 'apollo-server-express';

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

  async getDiscussionById(id: string) {
    return await this.companyDiscussionRepository.getDiscussionById(id);
  }
  async createDiscussion(
    input: CompanyDiscussionInput,
    userId: string,
  ): Promise<CompanyDiscussionPayload> {
    try {
      const company = await this.companyService.getCompanyById(input.companyId);
      if (!company)
        throw new ApolloError(
          COMPANY_MESSAGE.NOT_FOUND,
          COMPANY_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      if (company.ownerId === userId)
        return this.companyDiscussionRepository.createDiscussion(input, userId);
      const followedCompany =
        await this.followCompanyService.checkIfUserFollowCompany(
          input.companyId,
          userId,
        );
      if (!followedCompany)
        throw new ApolloError(
          COMPANY_DISCUSSION_MESSAGE.COMPANY_NOT_FOLLOWED,
          COMPANY_DISCUSSION_CODE.COMPANY_NOT_FOLLOWED,
          { statusCode: STATUS_CODE.BAD_CONFLICT },
        );
      return this.companyDiscussionRepository.createDiscussion(input, userId);
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async update(
    input: CompanyDiscussionUpdateInput,
    id: string,
    userId: string,
  ): Promise<CompanyDiscussionPayload> {
    try {
      const checkOwner = await this.companyDiscussionRepository.checkOwner(
        id,
        userId,
      );
      if (checkOwner)
        return await this.companyDiscussionRepository.update(input, id);
      const discussion =
        await this.companyDiscussionRepository.getDiscussionByIdAndUserId(
          id,
          userId,
        );
      if (!discussion)
        throw new ApolloError(
          COMPANY_DISCUSSION_MESSAGE.NOT_FOUND,
          COMPANY_DISCUSSION_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      const followedCompany =
        await this.followCompanyService.checkIfUserFollowCompany(
          discussion.companyId,
          userId,
        );
      if (!followedCompany)
        throw new ApolloError(
          COMPANY_DISCUSSION_MESSAGE.COMPANY_NOT_FOLLOWED,
          COMPANY_DISCUSSION_CODE.COMPANY_NOT_FOLLOWED,
          { statusCode: STATUS_CODE.BAD_CONFLICT },
        );
      return await this.companyDiscussionRepository.update(input, id);
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
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
        throw new ApolloError(
          COMPANY_DISCUSSION_MESSAGE.NOT_FOUND,
          COMPANY_DISCUSSION_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      const followedCompany =
        await this.followCompanyService.checkIfUserFollowCompany(
          discussion.companyId,
          userId,
        );
      if (!followedCompany)
        throw new ApolloError(
          COMPANY_DISCUSSION_MESSAGE.COMPANY_NOT_FOLLOWED,
          COMPANY_DISCUSSION_CODE.COMPANY_NOT_FOLLOWED,
          { statusCode: STATUS_CODE.BAD_CONFLICT },
        );
      return await this.companyDiscussionRepository.delete(id);
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
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
      const checkOwner = await this.companyDiscussionRepository.checkOwner(
        input.discussionId,
        userId,
      );
      if (checkOwner)
        return this.companyDiscussionRepository.createVote(input, userId);

      const discussion =
        await this.companyDiscussionRepository.getDiscussionById(
          input.discussionId,
        );
      if (!discussion)
        throw new ApolloError(
          COMPANY_DISCUSSION_MESSAGE.NOT_FOUND,
          COMPANY_DISCUSSION_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      const followedCompany =
        await this.followCompanyService.checkIfUserFollowCompany(
          discussion.companyId,
          userId,
        );
      if (!followedCompany)
        throw new ApolloError(
          COMPANY_DISCUSSION_MESSAGE.COMPANY_NOT_FOLLOWED,
          COMPANY_DISCUSSION_CODE.COMPANY_NOT_FOLLOWED,
          { statusCode: STATUS_CODE.BAD_CONFLICT },
        );
      return this.companyDiscussionRepository.createVote(input, userId);
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
  async downVote(
    input: DiscussionVoteInput,
    userId: string,
  ): Promise<DiscussionVotePayload> {
    try {
      const checkOwner = await this.companyDiscussionRepository.checkOwner(
        input.discussionId,
        userId,
      );
      if (checkOwner)
        return this.companyDiscussionRepository.downVote(input, userId);
      const discussion =
        await this.companyDiscussionRepository.getDiscussionById(
          input.discussionId,
        );
      if (!discussion)
        throw new ApolloError(
          COMPANY_DISCUSSION_MESSAGE.NOT_FOUND,
          COMPANY_DISCUSSION_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      const followedCompany =
        await this.followCompanyService.checkIfUserFollowCompany(
          discussion.companyId,
          userId,
        );
      if (!followedCompany)
        throw new ApolloError(
          COMPANY_DISCUSSION_MESSAGE.COMPANY_NOT_FOLLOWED,
          COMPANY_DISCUSSION_CODE.COMPANY_NOT_FOLLOWED,
          { statusCode: STATUS_CODE.BAD_CONFLICT },
        );
      return this.companyDiscussionRepository.downVote(input, userId);
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
}
