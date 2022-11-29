import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload';
import { customError } from 'src/common/errors';
import { COMMUNITY_CODE, COMPANY_CODE } from 'src/common/errors/error.code';
import {
  COMMUNITY_MESSAGE,
  COMPANY_MESSAGE,
} from 'src/common/errors/error.message';
import { STATUS_CODE } from 'src/common/errors/error.statusCode';
import { CompanyService } from 'src/modules/company/services/company.service';
import { CommunityEditInput, CommunityInput } from '../dto/community.input';
import {
  CommunityPayload,
  GetCommunityPayload,
} from '../entities/community-payload';
import { CommunityRepository } from '../repository/community.repository';

@Injectable()
export class CommunityService {
  constructor(
    private readonly communityRepository: CommunityRepository,
    private readonly companyService: CompanyService,
  ) {}

  async getCommunityByCompanyId(
    companyId: string,
  ): Promise<GetCommunityPayload> {
    const company = await this.companyService.getCompanyById(companyId);
    if (!company)
      return customError(
        COMPANY_MESSAGE.NOT_FOUND,
        COMPANY_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    return await this.communityRepository.getCommunityByCompanyId(companyId);
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
  ): Promise<CommunityPayload> {
    const community = await this.communityRepository.getCommunityById(
      communityId,
    );
    if (!community)
      return customError(
        COMMUNITY_MESSAGE.NOT_FOUND,
        COMMUNITY_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    return await this.communityRepository.editCommunity(input, communityId);
  }
}
