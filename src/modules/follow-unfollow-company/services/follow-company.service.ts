import { CompanyService } from './../../company/services/company.service';
import { OrderFollowedCompanyList } from 'src/modules/follow-unfollow-company/dto/follow-company.input';
import { Company } from 'src/modules/company/entities/company.entity';
import { UnfollowUserInput } from './../dto/unfollow-user.input';
import { UnfollowCompanyInput } from './../dto/unfollow-company.input';
import { FollowCompanyInput } from '../dto/follow-company.input';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { User } from 'src/modules/user/entities/user.entity';
import { FollowUnfollowCompany, FollowUserToUser } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { FollowUserToUserInput } from '../dto/follow-user.input';
import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';
import { haveNextPage } from 'src/modules/prisma/resolvers/pagination/pagination';
import { OrderListCompanies } from 'src/modules/company/dto/order-companies.input';
import { FilterListCompanies } from 'src/modules/company/dto/filter-company.input';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { findManyCursorConnection } from 'src/modules/prisma/resolvers/pagination/relay.pagination';
import { UnfollowPayload } from '../entities/unfollow.payload';
import { ApolloError } from 'apollo-server-express';
import { CompanyRepository } from 'src/modules/company/repository/company.repository';
import {
  COMPANY_MESSAGE,
  FOLLOW_MESSAGES,
} from 'src/common/errors/error.message';
import { COMPANY_CODE, FOLLOW_CODE } from 'src/common/errors/error.code';
import { STATUS_CODE } from 'src/common/errors/error.statusCode';
import { FollowUnfollowRepository } from '../repository/followUnfollow.repository';

@Injectable()
export class FollowCompanyService {
  constructor(
    private readonly followUnfollowRepository: FollowUnfollowRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}
  async followCompany(
    followCompany: FollowCompanyInput,
    user: User,
  ): Promise<FollowUnfollowCompany> {
    try {
      const company = await this.companyRepository.findCompany(
        followCompany.followedToId,
      );
      if (!company)
        throw new ApolloError(
          COMPANY_MESSAGE.NOT_FOUND,
          COMPANY_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      const checkFollowCompany =
        await this.followUnfollowRepository.checkIfUserFollowCompany(
          followCompany.followedToId,
          user.id,
        );
      if (checkFollowCompany)
        throw new ApolloError(
          FOLLOW_MESSAGES.COMPANY_ALREADY_FOLLOWED,
          FOLLOW_CODE.COMPANY_ALREADY_FOLLOWED,
          { statusCode: STATUS_CODE.BAD_CONFLICT },
        );
      return await this.followUnfollowRepository.followCompany(
        followCompany,
        user.id,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async unfollowCompany(
    company: UnfollowCompanyInput,
    user: User,
  ): Promise<UnfollowPayload> {
    try {
      const checkIfUserFollowCompany =
        await this.followUnfollowRepository.checkIfUserFollowCompany(
          company.companyId,
          user.id,
        );
      if (!checkIfUserFollowCompany)
        throw new ApolloError(
          FOLLOW_MESSAGES.COMPANY_NOT_FOLLOWED,
          FOLLOW_CODE.COMPANY_NOT_FOLLOWED,
          { statusCode: STATUS_CODE.BAD_CONFLICT },
        );
      return await this.followUnfollowRepository.unfollowCompany(
        company,
        user.id,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async followUserToUser(
    userToUser: FollowUserToUserInput,
    user: User,
  ): Promise<FollowUserToUser> {
    try {
      if (user.id === userToUser.followedToID)
        throw new ApolloError(
          FOLLOW_MESSAGES.INVALID_USER_ID,
          FOLLOW_CODE.INVALID_USER_ID,
          { statusCode: STATUS_CODE.BAD_CONFLICT },
        );
      const companyFollowedByTargetUser =
        await this.followUnfollowRepository.companyFollowedByUser(
          userToUser.followedToID,
        );
      const companyFollowedByMe =
        await this.followUnfollowRepository.companyFollowedByUser(user.id);
      const commonCompany =
        await this.followUnfollowRepository.checkForCommonCompany(
          companyFollowedByTargetUser,
          companyFollowedByMe,
        );

      if (!commonCompany.length)
        throw new ApolloError(
          FOLLOW_MESSAGES.NO_COMMON_COMPANY,
          FOLLOW_CODE.NO_COMMON_COMPANY,
          { statusCode: STATUS_CODE.BAD_REQUEST_EXCEPTION },
        );
      const checkFollowedUser =
        await this.followUnfollowRepository.checkFollowedUser(
          user.id,
          userToUser.followedToID,
        );
      if (checkFollowedUser)
        throw new ApolloError(
          FOLLOW_MESSAGES.USER_ALREADY_FOLLOWED,
          FOLLOW_CODE.USER_ALREADY_FOLLOWED,
          { statusCode: STATUS_CODE.NOT_SUPPORTED },
        );
      return await this.followUnfollowRepository.followUserToUser(
        userToUser,
        user,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async unfollowUser(
    targetUser: UnfollowUserInput,
    user: User,
  ): Promise<UnfollowPayload> {
    try {
      // do i need to check for userId in database or?
      const checkForUser =
        await this.followUnfollowRepository.checkFollowedUser(
          user.id,
          targetUser.userId,
        );
      if (!checkForUser)
        throw new ApolloError(
          FOLLOW_MESSAGES.USER_NOT_FOLLOWED,
          FOLLOW_CODE.USER_NOT_FOLLOWED,
          { statusCode: STATUS_CODE.NOT_SUPPORTED },
        );
      return await this.followUnfollowRepository.unfollowUser(
        targetUser,
        user.id,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
}
