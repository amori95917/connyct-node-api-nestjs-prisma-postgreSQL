import { FILE_MESSAGE } from './../../../common/errors/error.message';
import { CompanyEditInput } from './../dto/company-edit-input';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { REQUEST } from '@nestjs/core';

import { AccountStatus, BranchType } from '@prisma/client';
import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';
import { haveNextPage } from 'src/modules/prisma/resolvers/pagination/pagination';
import { FilterListCompanies } from '../dto/filter-company.input';
import { OrderListCompanies } from '../dto/order-companies.input';
import { PrismaService } from '../../prisma/prisma.service';
import { Company } from '../entities/company.entity';
import { CompanyBranchInput } from '../dto/company-branch.input';
import { Branch } from '../entities/branch.entity';
import { CompanyBranchEditInput } from '../dto/company-branch-edit.input';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { findManyCursorConnection } from 'src/modules/prisma/resolvers/pagination/relay.pagination';
import { FileUpload } from 'graphql-upload';
import { FileUploadService } from 'src/modules/files/services/file.service';
import { CloudinaryService } from 'src/modules/cloudinary/services/cloudinary.service';
import {
  CompanyDocumentEditPayload,
  CompanyPayload,
} from '../entities/company.payload';
import { customError } from 'src/common/errors';
import { COMPANY_MESSAGE } from 'src/common/errors/error.message';
import { COMPANY_CODE, FILE_CODE } from 'src/common/errors/error.code';
import { STATUS_CODE } from 'src/common/errors/error.statusCode';
import { CompanyAccountStatus } from '../dto/company-account-status.input';
import { STATUS_CODES } from 'http';
import { CompanyDocument } from '../entities/company-document.entity';
import {
  CompanyBranchDeletePayload,
  CompanyBranchPayload,
  GetCompanyBranchPayload,
} from '../entities/company-branch.payload';
import {
  CompanyDocumentEditInput,
  CompanyDocumentInput,
} from '../dto/company-document.input';
import { CompanyRepository } from '../repository/company.repository';
import { ApolloError } from 'apollo-server-express';
import { FollowUnfollowRepository } from 'src/modules/follow-unfollow-company/repository/followUnfollow.repository';

@Injectable({ scope: Scope.REQUEST })
export class CompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly followUnfollowRepository: FollowUnfollowRepository,
  ) {}

  async mutualCompany(
    paginate: ConnectionArgs,
    order: OrderListCompanies,
    filter: FilterListCompanies,
    targetUserId: string,
    userId: string,
  ) {
    try {
      const companyFollowedByTargetUser =
        await this.followUnfollowRepository.companyFollowedByUser(targetUserId);
      const companyFollowedByMe =
        await this.followUnfollowRepository.companyFollowedByUser(userId);
      const commonCompany =
        await this.followUnfollowRepository.checkForCommonCompany(
          companyFollowedByTargetUser,
          companyFollowedByMe,
        );
      const companyIds = commonCompany.map((company) => company.followedToId);
      return await this.companyRepository.getCompanyByIds(
        paginate,
        order,
        filter,
        companyIds,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async list(
    paginate: ConnectionArgs,
    order: OrderListCompanies,
    filter?: FilterListCompanies,
    companyids?: string[],
  ) {
    try {
      return await this.companyRepository.list(
        paginate,
        order,
        filter,
        companyids,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async getCompanyById(
    companyId: string,
    userId?: string,
  ): Promise<Company | null> {
    try {
      return await this.companyRepository.getCompanyById(companyId, userId);
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async getCompanyFollowersCount(companyId: string): Promise<number> {
    try {
      return await this.companyRepository.getCompanyFollowersCount(companyId);
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
  async createCompany(company: any) {
    return await this.companyRepository.createCompany(company);
  }
  async createCompanyGeneralInfo(generalCompany: any) {
    // const data: Pick<Prisma.CompanyCreateInput> =
    // TODO: Need a way to check if company already exists or not. Validation is needed
    return await this.companyRepository.createCompanyGeneralInfo(
      generalCompany,
    );
  }

  // async createCompanyAddress(companyAddress: CreateCompanyAddressInput) {
  //   return await this.prisma.company.findFirst();
  // }

  async editCompany(
    companyId: string,
    companyEditData: CompanyEditInput,
  ): Promise<CompanyPayload> {
    try {
      const companyData = await this.companyRepository.findCompany(companyId);
      if (!companyData)
        throw new ApolloError(
          COMPANY_MESSAGE.NOT_FOUND,
          COMPANY_CODE.NOT_FOUND,
          {
            statusCode: STATUS_CODE.NOT_FOUND,
          },
        );
      /**only if file exist */
      /**TODO */
      if (companyEditData.establishedDate >= new Date())
        throw new ApolloError(
          COMPANY_MESSAGE.INVALID_ESTABLISHED_DATE,
          COMPANY_CODE.INVALID_ESTABLISHED_DATE,
          { statusCode: STATUS_CODE.BAD_REQUEST_EXCEPTION },
        );
      return await this.companyRepository.editCompany(
        companyId,
        companyEditData,
        companyData,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
  async getCompanyByUserId(userId: string) {
    try {
      return await this.companyRepository.getCompanyByUserId(userId);
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async createCompanyBranch(
    companyId: string,
    branchInput: CompanyBranchInput,
  ): Promise<CompanyBranchPayload> {
    try {
      if (await this.companyRepository.isCompanyExist(companyId)) {
        const isHeadOfficeAlreadyExist =
          branchInput.type === BranchType.HEADQUARTER
            ? await this.companyRepository.isHeadOfficeAlreadyExist(companyId)
            : false;
        if (isHeadOfficeAlreadyExist)
          throw new ApolloError(
            COMPANY_MESSAGE.CANNOT_HAVE_MULTIPLE_HEADQUARTER,
            COMPANY_CODE.CANNOT_HAVE_MULTIPLE_HEADQUARTER,
            { statusCode: STATUS_CODE.BAD_CONFLICT },
          );
        if (
          await this.companyRepository.getBranchByEmail(
            branchInput.contactEmail,
          )
        )
          throw new ApolloError(
            COMPANY_MESSAGE.BRANCH_EMAIL_ALREADY_EXIST,
            COMPANY_CODE.BRANCH_EMAIL_ALREADY_EXIST,
            { statusCode: STATUS_CODE.NOT_SUPPORTED },
          );
        if (
          await this.companyRepository.getBranchByNumber(
            branchInput.contactNumber,
          )
        )
          throw new ApolloError(
            COMPANY_MESSAGE.BRANCH_NUMBER_ALREADY_EXIST,
            COMPANY_CODE.BRANCH_NUMBER_ALREADY_EXIST,
            { statusCode: STATUS_CODE.NOT_SUPPORTED },
          );
        return await this.companyRepository.createCompanyBranch(
          companyId,
          branchInput,
        );
      } else {
        throw new ApolloError(
          COMPANY_MESSAGE.NOT_FOUND,
          COMPANY_CODE.NOT_FOUND,
          {
            statusCode: STATUS_CODE.NOT_FOUND,
          },
        );
      }
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async getBranchesByCompanyId(
    companyId: string,
  ): Promise<GetCompanyBranchPayload> {
    try {
      if (await this.companyRepository.isCompanyExist(companyId)) {
        return await this.companyRepository.getBranchesByCompanyId(companyId);
      } else {
        throw new ApolloError(
          COMPANY_MESSAGE.NOT_FOUND,
          COMPANY_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      }
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async editCompanyBranch(
    branchId: string,
    branchEditInput: CompanyBranchEditInput,
  ): Promise<CompanyBranchPayload> {
    try {
      const branch = await this.companyRepository.isBranchExist(branchId);
      if (!branch)
        throw new ApolloError(
          COMPANY_MESSAGE.BRANCH_NOT_FOUND,
          COMPANY_CODE.BRANCH_NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      const isHeadOfficeAlreadyExist =
        branchEditInput.type === BranchType.HEADQUARTER
          ? await this.companyRepository.isHeadOfficeAlreadyExist(
              branch.companyId,
            )
          : false;
      if (isHeadOfficeAlreadyExist)
        throw new ApolloError(
          COMPANY_MESSAGE.CANNOT_HAVE_MULTIPLE_HEADQUARTER,
          COMPANY_CODE.CANNOT_HAVE_MULTIPLE_HEADQUARTER,
          { statusCode: STATUS_CODE.BAD_CONFLICT },
        );
      return await this.companyRepository.editCompanyBranch(
        branchId,
        branchEditInput,
        branch,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async deleteCompanyBranch(
    companyId: string,
    branchId: string,
  ): Promise<CompanyBranchDeletePayload> {
    try {
      if (await this.companyRepository.isCompanyExist(companyId)) {
        const branch = await this.companyRepository.isBranchExist(branchId);
        if (branch) {
          return await this.companyRepository.deleteCompanyBranch(branchId);
        } else {
          throw new ApolloError(
            COMPANY_MESSAGE.BRANCH_NOT_FOUND,
            COMPANY_CODE.BRANCH_NOT_FOUND,
            { statusCode: STATUS_CODE.NOT_FOUND },
          );
        }
      } else {
        throw new ApolloError(
          COMPANY_MESSAGE.NOT_FOUND,
          COMPANY_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      }
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async updateAccountStatus(
    id: string,
    accountStatus,
    reason?: string,
  ): Promise<Company> {
    return await this.companyRepository.updateAccountStatus(
      id,
      accountStatus,
      reason,
    );
  }

  async companyAccountStatus(
    data: CompanyAccountStatus,
    id: string,
  ): Promise<CompanyPayload> {
    try {
      const company = await this.companyRepository.findCompany(id);
      if (!company)
        throw new ApolloError(
          COMPANY_MESSAGE.NOT_FOUND,
          COMPANY_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      if (data.accountStatus === 'REJECTED') {
        if (!data.reason)
          throw new ApolloError(
            COMPANY_MESSAGE.ACCOUNT_STATUS_REASON,
            COMPANY_CODE.ACCOUNT_STATUS_REASON,
            { statusCode: STATUS_CODE.BAD_CONFLICT },
          );
        const status = await this.updateAccountStatus(
          id,
          data.accountStatus,
          data.reason,
        );
        return { company: status };
      }
      const companyStatus = await this.updateAccountStatus(
        id,
        data.accountStatus,
        data.reason,
      );
      return { company: companyStatus };
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async uploadAvatar(id: string, avatar: FileUpload): Promise<CompanyPayload> {
    try {
      const companyData = await this.getCompanyById(id);
      if (!companyData)
        throw new ApolloError(
          COMPANY_MESSAGE.NOT_FOUND,
          COMPANY_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );

      return await this.companyRepository.uploadAvatar(id, avatar, companyData);
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async getCompanyDocument(companyId: string): Promise<CompanyDocument[]> {
    try {
      return await this.companyRepository.getCompanyDocument(companyId);
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
  async getCompanyDocumentById(id: string): Promise<CompanyDocument> {
    try {
      return await this.companyRepository.getCompanyDocumentById(id);
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async companyDocument(
    input: CompanyDocumentInput,
    document: FileUpload[],
  ): Promise<CompanyPayload> {
    try {
      const companyData = await this.getCompanyById(input.companyId);
      if (!companyData)
        throw new ApolloError(
          COMPANY_MESSAGE.NOT_FOUND,
          COMPANY_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      if (!document)
        throw new ApolloError(FILE_MESSAGE.REQUIRED, FILE_CODE.REQUIRED, {
          statusCode: STATUS_CODE.BAD_CONFLICT,
        });

      return await this.companyRepository.companyDocument(
        input,
        document,
        companyData,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async editCompanyDocument(
    companyId: string,
    documentId: string,
    editDocument: CompanyDocumentEditInput,
    document: FileUpload,
  ): Promise<CompanyDocumentEditPayload> {
    try {
      const company = await this.getCompanyById(companyId);
      if (!company)
        throw new ApolloError(
          COMPANY_MESSAGE.NOT_FOUND,
          COMPANY_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      const companyDocument = await this.getCompanyDocumentById(documentId);
      if (!companyDocument)
        throw new ApolloError(
          COMPANY_MESSAGE.COMPANY_DOCUMENT_NOT_FOUND,
          COMPANY_CODE.COMPANY_DOCUMENT_NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      return await this.companyRepository.editCompanyDocument(
        companyId,
        documentId,
        editDocument,
        document,
        companyDocument,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
}
