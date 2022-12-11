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
  CompanyPolicyUpdateInput,
} from '../dto/policy.input';

@Injectable()
export class CommunityService {
  constructor(
    private readonly communityRepository: CommunityRepository,
    private readonly companyService: CompanyService,
    private readonly followService: FollowCompanyService,
  ) {}

  async getCommunityByCompanyId(
    companyId: string,
    paginate: ConnectionArgs,
    order: OrderListCommunity,
  ): Promise<GetCommunityPayload> {
    const company = await this.companyService.getCompanyById(companyId);
    if (!company)
      return customError(
        COMPANY_MESSAGE.NOT_FOUND,
        COMPANY_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    return await this.communityRepository.getCommunityByCompanyId(
      companyId,
      paginate,
      order,
    );
  }
  async getCommunityById(communityId: string): Promise<CommunityPayload> {
    const community = await this.communityRepository.getCommunityById(
      communityId,
    );
    return { community };
  }

  async createCommunity(
    input: CommunityInput,
    profile: FileUpload,
    userId: string,
  ): Promise<CommunityPayload> {
    const company = await this.companyService.getCompanyById(input.companyId);
    if (!company)
      return customError(
        COMPANY_MESSAGE.NOT_FOUND,
        COMPANY_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    return await this.communityRepository.createCommunity(
      input,
      profile,
      userId,
    );
  }

  async editCommunity(
    input: CommunityEditInput,
    communityId: string,
    profile: FileUpload,
    userId: string,
  ): Promise<CommunityPayload> {
    const community = await this.communityRepository.getCommunityByIdAndUserId(
      communityId,
      userId,
    );
    if (!community)
      return customError(
        COMMUNITY_MESSAGE.NOT_FOUND,
        COMMUNITY_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    return await this.communityRepository.editCommunity(
      input,
      communityId,
      community,
      profile,
    );
  }

  async deleteCommunity(
    communityId: string,
    creatorId: string,
  ): Promise<CommunityDeletePayload> {
    const community = await this.communityRepository.getCommunityByIdAndUserId(
      communityId,
      creatorId,
    );
    if (!community)
      return customError(
        COMMUNITY_MESSAGE.NOT_FOUND,
        COMMUNITY_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    return await this.communityRepository.deleteCommunity(
      communityId,
      community.profile,
    );
  }

  async getCommunityMember(
    communityId: string,
    paginate: ConnectionArgs,
    order: OrderListCommunityMember,
  ): Promise<GetCommunityMemberPayload> {
    const community = await this.communityRepository.getCommunityById(
      communityId,
    );
    if (!community)
      return customError(
        COMMUNITY_MESSAGE.NOT_FOUND,
        COMMUNITY_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    return await this.communityRepository.getCommunityMember(
      communityId,
      paginate,
      order,
    );
  }

  async inviteUserByAdmin(
    input: CommunityMemberInviteInput,
    invitedById: string,
  ): Promise<CommunityMemberPayload> {
    const community = await this.communityRepository.getCommunityById(
      input.communityId,
    );
    if (!community)
      return customError(
        COMMUNITY_MESSAGE.NOT_FOUND,
        COMMUNITY_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );

    return await this.communityRepository.inviteUser(input, invitedById);
  }

  async acceptCommunityInvite(
    companyId: string,
    communityMemberId: string,
    userId: string,
  ): Promise<AcceptInvitePayload> {
    const alreadyAccepted = await this.communityRepository.checkMemberExist(
      communityMemberId,
    );
    if (alreadyAccepted)
      return customError(
        COMMUNITY_MESSAGE.COMMUNITY_ALREADY_JOINED,
        COMMUNITY_CODE.COMMUNITY_ALREADY_JOINED,
        STATUS_CODE.BAD_CONFLICT,
      );
    const follow = await this.followService.checkIfUserFollowCompany(
      companyId,
      userId,
    );
    if (!follow)
      return customError(
        COMPANY_DISCUSSION_MESSAGE.COMPANY_NOT_FOLLOWED,
        COMPANY_DISCUSSION_CODE.COMPANY_NOT_FOLLOWED,
        STATUS_CODE.BAD_CONFLICT,
      );
    return await this.communityRepository.acceptCommunityInvite(
      communityMemberId,
    );
  }

  async inviteUserByCommunityUser(
    input: CommunityMemberInviteInput,
    userId: string,
  ): Promise<CommunityMemberPayload> {
    const community = await this.communityRepository.getCommunityById(
      input.communityId,
    );
    if (!community)
      return customError(
        COMMUNITY_MESSAGE.NOT_FOUND,
        COMMUNITY_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    const follow = await this.followService.checkIfUserFollowCompany(
      input.companyId,
      userId,
    );
    if (!follow)
      return customError(
        COMPANY_DISCUSSION_MESSAGE.COMPANY_NOT_FOLLOWED,
        COMPANY_DISCUSSION_CODE.COMPANY_NOT_FOLLOWED,
        STATUS_CODE.BAD_CONFLICT,
      );
    const communityMember =
      await this.communityRepository.checkCommunityMemberExist(
        input.communityId,
        userId,
      );
    if (!communityMember)
      return customError(
        COMMUNITY_MESSAGE.COMMUNITY_NOT_JOINED,
        COMMUNITY_CODE.COMMUNITY_NOT_JOINED,
        STATUS_CODE.BAD_REQUEST_EXCEPTION,
      );
    return await this.communityRepository.inviteUser(input, userId);
  }

  async joinPublicCommunity(
    input: CommunityMemberInput,
    userId: string,
  ): Promise<JoinCommunityPayload> {
    const follow = await this.followService.checkIfUserFollowCompany(
      input.companyId,
      userId,
    );
    if (!follow)
      return customError(
        COMPANY_DISCUSSION_MESSAGE.COMPANY_NOT_FOLLOWED,
        COMPANY_DISCUSSION_CODE.COMPANY_NOT_FOLLOWED,
        STATUS_CODE.BAD_CONFLICT,
      );
    const publicCommunity = await this.communityRepository.findPublicCommunity(
      input.communityId,
    );
    if (!publicCommunity)
      return customError(
        COMMUNITY_MESSAGE.MUST_BE_PUBLIC_COMMUNITY,
        COMMUNITY_CODE.MUST_BE_PUBLIC_COMMUNITY,
        STATUS_CODE.NOT_SUPPORTED,
      );
    const alreadyAccepted =
      await this.communityRepository.checkCommunityMemberExist(
        input.communityId,
        userId,
      );
    if (alreadyAccepted)
      return customError(
        COMMUNITY_MESSAGE.COMMUNITY_ALREADY_JOINED,
        COMMUNITY_CODE.COMMUNITY_ALREADY_JOINED,
        STATUS_CODE.BAD_CONFLICT,
      );
    return await this.communityRepository.joinPublicCommunity(input, userId);
  }

  async getCommunityPolicies(communityId: string, paginate: ConnectionArgs) {
    const community = await this.communityRepository.getCommunityById(
      communityId,
    );
    if (!community)
      return customError(
        COMMUNITY_MESSAGE.NOT_FOUND,
        COMMUNITY_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    return await this.communityRepository.getCommunityPolicies(
      communityId,
      paginate,
    );
  }

  async getCommunityPolicy(policyId: string) {
    return await this.communityRepository.getCommunityPolicy(policyId);
  }

  async createCommunityPolicy(
    communityId: string,
    input: CommunityPolicyInput,
  ) {
    const community = await this.communityRepository.getCommunityById(
      communityId,
    );
    if (!community) {
      return customError(
        COMMUNITY_MESSAGE.NOT_FOUND,
        COMMUNITY_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    }
    return await this.communityRepository.createCommunityPolicy(
      communityId,
      input,
    );
  }

  async updateCommunityPolicy(id: string, input: CompanyPolicyUpdateInput) {
    const policy = await this.getCommunityPolicy(id);
    if (!policy) {
      return customError(
        COMMUNITY_POLICY_MESSAGE.NOT_FOUND,
        COMMUNITY_POLICY_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    }
    return await this.communityRepository.updateCommunityPolicy(id, input);
  }

  async deleteCommunityPolicy(id: string) {
    const policy = await this.getCommunityPolicy(id);
    if (!policy) {
      return customError(
        COMMUNITY_POLICY_MESSAGE.NOT_FOUND,
        COMMUNITY_POLICY_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    }
    return await this.communityRepository.deleteCommunityPolicy(id);
  }
}
