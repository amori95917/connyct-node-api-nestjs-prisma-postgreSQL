import { FollowCompanyService } from './../../follow-unfollow-company/services/follow-company.service';
import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload';
import { customError } from 'src/common/errors';
import {
  COMMENT_CODE,
  COMMUNITY_CODE,
  COMMUNITY_POLICY_CODE,
  COMPANY_CODE,
  COMPANY_DISCUSSION_CODE,
} from 'src/common/errors/error.code';
import {
  COMMUNITY_MESSAGE,
  COMMUNITY_POLICY_MESSAGE,
  COMPANY_DISCUSSION_MESSAGE,
  COMPANY_MESSAGE,
} from 'src/common/errors/error.message';
import { STATUS_CODE } from 'src/common/errors/error.statusCode';
import { CompanyService } from 'src/modules/company/services/company.service';
import {
  CommunityMemberInput,
  CommunityMemberInviteInput,
} from '../dto/community-member.input';
import { CommunityEditInput, CommunityInput } from '../dto/community.input';
import {
  AcceptInvitePayload,
  CommunityMemberPayload,
  GetCommunityMemberPayload,
  JoinCommunityPayload,
} from '../entities/community-member.payload';
import {
  CommunityDeletePayload,
  CommunityPayload,
  GetCommunityPayload,
} from '../entities/community-payload';
import { CommunityRepository } from '../repository/community.repository';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { OrderListCommunity } from '../dto/order-community.input';
import { OrderListCommunityMember } from '../dto/order-community-members.input';
import {
  CommunityPolicyInput,
  CommunityPolicyUpdateInput,
} from '../dto/policy.input';
import { ApolloError } from 'apollo-server-express';
import { FollowUnfollowRepository } from 'src/modules/follow-unfollow-company/repository/followUnfollow.repository';

@Injectable()
export class CommunityService {
  constructor(
    private readonly communityRepository: CommunityRepository,
    private readonly companyService: CompanyService,
    private readonly followUnfollowRepository: FollowUnfollowRepository,
  ) {}

  async getCommunityByCompanyId(
    companyId: string,
    paginate: ConnectionArgs,
    order: OrderListCommunity,
    userId?: string,
  ): Promise<GetCommunityPayload> {
    try {
      const company = await this.companyService.getCompanyById(companyId);
      if (!company)
        throw new ApolloError(
          COMPANY_MESSAGE.NOT_FOUND,
          COMPANY_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );

      return await this.communityRepository.getCommunityByCompanyId(
        companyId,
        paginate,
        order,
        userId,
        company.ownerId,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
  async getCommunityById(
    communityId: string,
    userId: string,
  ): Promise<CommunityPayload> {
    const community = await this.communityRepository.getCommunityById(
      communityId,
      userId,
    );
    return { community };
  }

  async createCommunity(
    input: CommunityInput,
    profile: FileUpload,
    coverImage: FileUpload,
    userId: string,
  ): Promise<CommunityPayload> {
    try {
      const company = await this.companyService.getCompanyById(input.companyId);
      if (!company)
        throw new ApolloError(
          COMPANY_MESSAGE.NOT_FOUND,
          COMPANY_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      if (company.ownerId !== userId)
        throw new ApolloError(
          COMMUNITY_MESSAGE.NOT_A_OWNER,
          COMMUNITY_CODE.NOT_A_OWNER,
          { statusCode: STATUS_CODE.NOT_SUPPORTED },
        );
      return await this.communityRepository.createCommunity(
        input,
        profile,
        coverImage,
        userId,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async editCommunity(
    input: CommunityEditInput,
    communityId: string,
    profile: FileUpload,
    coverImage: FileUpload,
    userId: string,
  ): Promise<CommunityPayload> {
    try {
      const community =
        await this.communityRepository.getCommunityByIdAndUserId(
          communityId,
          userId,
        );
      if (!community)
        throw new ApolloError(
          COMMUNITY_MESSAGE.NOT_FOUND,
          COMMUNITY_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      return await this.communityRepository.editCommunity(
        input,
        communityId,
        community,
        profile,
        coverImage,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async deleteCommunity(
    communityId: string,
    creatorId: string,
  ): Promise<CommunityDeletePayload> {
    try {
      const community =
        await this.communityRepository.getCommunityByIdAndUserId(
          communityId,
          creatorId,
        );
      if (!community)
        throw new ApolloError(
          COMMUNITY_MESSAGE.NOT_FOUND,
          COMMUNITY_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      return await this.communityRepository.deleteCommunity(
        communityId,
        community.profile,
        community.coverImage,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async getCommunityMember(
    communityId: string,
    paginate: ConnectionArgs,
    order: OrderListCommunityMember,
  ): Promise<GetCommunityMemberPayload> {
    try {
      const community = await this.communityRepository.getCommunityById(
        communityId,
      );
      if (!community)
        throw new ApolloError(
          COMMUNITY_MESSAGE.NOT_FOUND,
          COMMUNITY_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      return await this.communityRepository.getCommunityMember(
        communityId,
        paginate,
        order,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async inviteUserByAdmin(
    input: CommunityMemberInviteInput,
    invitedById: string,
  ): Promise<CommunityMemberPayload> {
    try {
      const community = await this.communityRepository.getCommunityById(
        input.communityId,
      );
      if (!community)
        throw new ApolloError(
          COMMUNITY_MESSAGE.NOT_FOUND,
          COMMUNITY_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      if (!input.memberId.length)
        throw new ApolloError(
          COMMUNITY_MESSAGE.ATLEAST_SELECT_A_MEMBER,
          COMMUNITY_CODE.ATLEAST_SELECT_A_MEMBER,
          { statusCode: STATUS_CODE.BAD_CONFLICT },
        );

      return await this.communityRepository.inviteUser(input, invitedById);
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async acceptCommunityInvite(
    companyId: string,
    communityMemberId: string,
    userId: string,
  ): Promise<AcceptInvitePayload> {
    try {
      const alreadyAccepted = await this.communityRepository.checkMemberExist(
        communityMemberId,
      );
      if (alreadyAccepted)
        throw new ApolloError(
          COMMUNITY_MESSAGE.COMMUNITY_ALREADY_JOINED,
          COMMUNITY_CODE.COMMUNITY_ALREADY_JOINED,
          { statusCode: STATUS_CODE.BAD_CONFLICT },
        );
      const follow =
        await this.followUnfollowRepository.checkIfUserFollowCompany(
          companyId,
          userId,
        );
      if (!follow)
        throw new ApolloError(
          COMPANY_DISCUSSION_MESSAGE.COMPANY_NOT_FOLLOWED,
          COMPANY_DISCUSSION_CODE.COMPANY_NOT_FOLLOWED,
          { statusCode: STATUS_CODE.BAD_CONFLICT },
        );
      return await this.communityRepository.acceptCommunityInvite(
        communityMemberId,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async inviteUserByCommunityUser(
    input: CommunityMemberInviteInput,
    userId: string,
  ): Promise<CommunityMemberPayload> {
    try {
      const community = await this.communityRepository.getCommunityById(
        input.communityId,
      );
      if (!community)
        throw new ApolloError(
          COMMUNITY_MESSAGE.NOT_FOUND,
          COMMUNITY_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      const follow =
        await this.followUnfollowRepository.checkIfUserFollowCompany(
          input.companyId,
          userId,
        );
      if (!follow)
        throw new ApolloError(
          COMPANY_DISCUSSION_MESSAGE.COMPANY_NOT_FOLLOWED,
          COMPANY_DISCUSSION_CODE.COMPANY_NOT_FOLLOWED,
          { statusCode: STATUS_CODE.BAD_CONFLICT },
        );
      const communityMember =
        await this.communityRepository.checkCommunityMemberExist(
          input.communityId,
          userId,
        );
      if (!communityMember)
        throw new ApolloError(
          COMMUNITY_MESSAGE.COMMUNITY_NOT_JOINED,
          COMMUNITY_CODE.COMMUNITY_NOT_JOINED,
          { statusCode: STATUS_CODE.BAD_REQUEST_EXCEPTION },
        );
      return await this.communityRepository.inviteUser(input, userId);
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async joinPublicCommunity(
    input: CommunityMemberInput,
    userId: string,
  ): Promise<JoinCommunityPayload> {
    try {
      // const follow = await this.followUnfollowRepository.checkIfUserFollowCompany(
      //   input.companyId,
      //   userId,
      // );
      // if (!follow)
      //   return customError(
      //     COMPANY_DISCUSSION_MESSAGE.COMPANY_NOT_FOLLOWED,
      //     COMPANY_DISCUSSION_CODE.COMPANY_NOT_FOLLOWED,
      //     STATUS_CODE.BAD_CONFLICT,
      //   );

      const communityAdmin =
        await this.communityRepository.getCommunityByIdAndUserId(
          input.communityId,
          userId,
        );
      if (communityAdmin)
        throw new ApolloError(
          COMMUNITY_MESSAGE.ALREADY_A_OWNER,
          COMMUNITY_CODE.ALREADY_A_OWNER,
          { statusCode: STATUS_CODE.BAD_CONFLICT },
        );
      const publicCommunity =
        await this.communityRepository.findPublicCommunity(input.communityId);
      if (!publicCommunity)
        throw new ApolloError(
          COMMUNITY_MESSAGE.MUST_BE_PUBLIC_COMMUNITY,
          COMMUNITY_CODE.MUST_BE_PUBLIC_COMMUNITY,
          { statusCode: STATUS_CODE.NOT_SUPPORTED },
        );

      const alreadyAccepted =
        await this.communityRepository.checkCommunityMemberExist(
          input.communityId,
          userId,
        );
      if (alreadyAccepted)
        throw new ApolloError(
          COMMUNITY_MESSAGE.COMMUNITY_ALREADY_JOINED,
          COMMUNITY_CODE.COMMUNITY_ALREADY_JOINED,
          { statusCode: STATUS_CODE.BAD_CONFLICT },
        );
      return await this.communityRepository.joinPublicCommunity(input, userId);
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async getCommunityPolicies(communityId: string, paginate: ConnectionArgs) {
    try {
      const community = await this.communityRepository.getCommunityById(
        communityId,
      );
      if (!community)
        throw new ApolloError(
          COMMUNITY_MESSAGE.NOT_FOUND,
          COMMUNITY_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      return await this.communityRepository.getCommunityPolicies(
        communityId,
        paginate,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async getCommunityPolicy(policyId: string) {
    return await this.communityRepository.getCommunityPolicy(policyId);
  }

  async createCommunityPolicy(
    communityId: string,
    input: CommunityPolicyInput,
  ) {
    try {
      const community = await this.communityRepository.getCommunityById(
        communityId,
      );
      if (!community) {
        throw new ApolloError(
          COMMUNITY_MESSAGE.NOT_FOUND,
          COMMUNITY_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      }
      return await this.communityRepository.createCommunityPolicy(
        communityId,
        input,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async updateCommunityPolicy(id: string, input: CommunityPolicyUpdateInput) {
    try {
      const policy = await this.getCommunityPolicy(id);
      if (!policy) {
        throw new ApolloError(
          COMMUNITY_POLICY_MESSAGE.NOT_FOUND,
          COMMUNITY_POLICY_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      }
      return await this.communityRepository.updateCommunityPolicy(id, input);
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async deleteCommunityPolicy(id: string) {
    try {
      const policy = await this.getCommunityPolicy(id);
      if (!policy) {
        throw new ApolloError(
          COMMUNITY_POLICY_MESSAGE.NOT_FOUND,
          COMMUNITY_POLICY_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      }
      return await this.communityRepository.deleteCommunityPolicy(id);
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
}
