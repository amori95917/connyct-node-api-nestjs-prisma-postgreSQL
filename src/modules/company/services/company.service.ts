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

@Injectable({ scope: Scope.REQUEST })
export class CompanyService {
  private allowOperation: boolean;

  constructor(
    @Inject(REQUEST) private request,
    @Inject(CONTEXT) private context,
    private prisma: PrismaService,
    private fileUploadService: FileUploadService,
    private cloudinary: CloudinaryService,
  ) {
    this.allowOperation = this.context?.req?.user?.isAdmin;
  }

  public setAllowOperation(value: boolean) {
    this.allowOperation = value;
  }

  async getCompanyFollowersCount(companyId: string): Promise<number> {
    try {
      return await this.prisma.followUnfollowCompany.count({
        where: { followedToId: companyId },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async list(
    paginate: ConnectionArgs,
    order: OrderListCompanies,
    filter?: FilterListCompanies,
    companyids?: string[],
  ) {
    try {
      const baseArgs = {
        where: {
          id: {
            notIn: companyids,
          },
        },
        orderBy: { [order.orderBy]: order.direction },
      };
      if (filter?.omni) {
        baseArgs['name'] = {
          contains: filter.omni,
          mode: 'insensitive',
        };
      }
      const companies = await findManyCursorConnection(
        (args) => this.prisma.company.findMany({ ...args, ...baseArgs }),
        () =>
          this.prisma.company.count({
            where: baseArgs.where,
          }),
        { ...paginate },
      );
      await Promise.all(
        companies?.edges.map(async (company) => {
          const followers = await this.getCompanyFollowersCount(
            company.node.id,
          );
          Object.assign(company, { ...company.node, followers });
        }),
      );
      return companies;

      // const nodes = await this.prisma.company.findMany({
      //   skip: paginate.skip,
      //   take: paginate.take,
      //   orderBy: { [order.orderBy]: order.direction },
      //   where: {
      //     ...(filter?.omni && {
      //       name: { contains: filter.omni, mode: 'insensitive' },
      //     }),
      //     id: {
      //       notIn: companyids,
      //     },
      //   },
      // });
      // await Promise.all(
      //   nodes.map(async (company) => {
      //     const followers = await this.getCompanyFollowersCount(company.id);
      //     Object.assign(company, { followers });
      //   }),
      // );
      // const totalCount = await this.prisma.company.count({});
      // const hasNextPage = haveNextPage(
      //   paginate.skip,
      //   paginate.take,
      //   totalCount,
      // );
      // return {
      //   nodes,
      //   totalCount,
      //   hasNextPage,
      //   edges: nodes?.map((node) => ({
      //     node,
      //     cursor: Buffer.from(node.id).toString('base64'),
      //   })),
      // };
    } catch (e) {
      throw new Error(e);
    }
  }

  async getCompanyById(
    companyId: string,
    userId?: string,
  ): Promise<Company | null> {
    try {
      const company = await this.prisma.company.findFirst({
        where: { id: companyId },
      });
      if (!company) return null;
      const followers = await this.getCompanyFollowersCount(companyId);
      const hasFollowedByUser =
        await this.prisma.followUnfollowCompany.findMany({
          where: {
            followedById: userId,
            followedToId: companyId,
          },
        });
      return Object.assign(company, {
        followers,
        hasFollowedByUser: hasFollowedByUser.length > 0,
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async createCompany(company: any) {
    return await this.prisma.company.create({
      data: {
        ...company,
        employees: { create: { employeeId: this.request?.user?.id } },
      },
    });
  }

  async createCompanyGeneralInfo(generalCompany: any) {
    // const data: Pick<Prisma.CompanyCreateInput> =
    // TODO: Need a way to check if company already exists or not. Validation is needed
    return await this.prisma.company.create({
      data: {
        ...generalCompany,
        employees: { create: { employeeId: this.request?.user?.id } },
      },
    });
  }

  // async createCompanyAddress(companyAddress: CreateCompanyAddressInput) {
  //   return await this.prisma.company.findFirst();
  // }

  async editCompany(
    companyId: string,
    companyEditData: CompanyEditInput,
  ): Promise<CompanyPayload> {
    try {
      const companyData = await this.prisma.company.findFirst({
        where: { id: companyId },
      });
      if (!companyData)
        return customError(
          COMPANY_MESSAGE.NOT_FOUND,
          COMPANY_CODE.NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );
      /**only if file exist */
      /**TODO */
      if (companyEditData.establishedDate >= new Date())
        return customError(
          COMPANY_MESSAGE.INVALID_ESTABLISHED_DATE,
          COMPANY_CODE.INVALID_ESTABLISHED_DATE,
          STATUS_CODE.BAD_REQUEST_EXCEPTION,
        );
      const updatedData = await this.prisma.company.update({
        where: { id: companyId },
        data: {
          ...companyData,
          ...companyEditData,
          accountStatus: AccountStatus.REVIEW,
        },
      });
      return { company: updatedData };
    } catch (e) {
      throw new Error(e);
    }
  }
  async getCompanyByUserId(userId: string) {
    try {
      return await this.prisma.company.findMany({
        where: { ownerId: userId },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async isCompanyExist(companyId: string) {
    return await this.prisma.company.findFirst({
      where: { id: companyId },
    });
  }

  async isHeadOfficeAlreadyExist(companyId: string) {
    return await this.prisma.branch.findFirst({
      where: {
        companyId,
        type: BranchType.HEADQUARTER,
      },
    });
  }

  async getBranchByEmail(contactEmail: string) {
    return await this.prisma.branch.findUnique({ where: { contactEmail } });
  }
  async getBranchByNumber(contactNumber: string) {
    return await this.prisma.branch.findUnique({ where: { contactNumber } });
  }

  async isBranchExist(id: string) {
    return await this.prisma.branch.findFirst({
      where: { id },
    });
  }

  async createCompanyBranch(
    companyId: string,
    branchInput: CompanyBranchInput,
  ): Promise<CompanyBranchPayload> {
    if (await this.isCompanyExist(companyId)) {
      const isHeadOfficeAlreadyExist =
        branchInput.type === BranchType.HEADQUARTER
          ? await this.isHeadOfficeAlreadyExist(companyId)
          : false;
      if (isHeadOfficeAlreadyExist)
        return customError(
          COMPANY_MESSAGE.CANNOT_HAVE_MULTIPLE_HEADQUARTER,
          COMPANY_CODE.CANNOT_HAVE_MULTIPLE_HEADQUARTER,
          STATUS_CODE.BAD_CONFLICT,
        );
      if (await this.getBranchByEmail(branchInput.contactEmail))
        return customError(
          COMPANY_MESSAGE.BRANCH_EMAIL_ALREADY_EXIST,
          COMPANY_CODE.BRANCH_EMAIL_ALREADY_EXIST,
          STATUS_CODE.NOT_SUPPORTED,
        );
      if (await this.getBranchByNumber(branchInput.contactNumber))
        return customError(
          COMPANY_MESSAGE.BRANCH_NUMBER_ALREADY_EXIST,
          COMPANY_CODE.BRANCH_NUMBER_ALREADY_EXIST,
          STATUS_CODE.NOT_SUPPORTED,
        );
      const branch = await this.prisma.branch.create({
        data: { ...branchInput, companyId },
      });
      return { branch };
    } else {
      return customError(
        COMPANY_MESSAGE.NOT_FOUND,
        COMPANY_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    }
  }

  async getBranchesByCompanyId(
    companyId: string,
  ): Promise<GetCompanyBranchPayload> {
    try {
      if (await this.isCompanyExist(companyId)) {
        const branches = await this.prisma.branch.findMany({
          where: { companyId },
        });
        return { branches };
      } else {
        return customError(
          COMPANY_MESSAGE.NOT_FOUND,
          COMPANY_CODE.NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async editCompanyBranch(
    branchId: string,
    branchEditInput: CompanyBranchEditInput,
  ): Promise<CompanyBranchPayload> {
    try {
      const branch = await this.isBranchExist(branchId);
      if (!branch)
        return customError(
          COMPANY_MESSAGE.BRANCH_NOT_FOUND,
          COMPANY_CODE.BRANCH_NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );
      const isHeadOfficeAlreadyExist =
        branchEditInput.type === BranchType.HEADQUARTER
          ? await this.isHeadOfficeAlreadyExist(branch.companyId)
          : false;
      if (isHeadOfficeAlreadyExist)
        return customError(
          COMPANY_MESSAGE.CANNOT_HAVE_MULTIPLE_HEADQUARTER,
          COMPANY_CODE.CANNOT_HAVE_MULTIPLE_HEADQUARTER,
          STATUS_CODE.BAD_CONFLICT,
        );
      const editedBranch = await this.prisma.branch.update({
        where: { id: branchId },
        data: { ...branch, ...branchEditInput },
      });
      return { branch: editedBranch };
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteCompanyBranch(
    companyId: string,
    branchId: string,
  ): Promise<CompanyBranchDeletePayload> {
    try {
      if (await this.isCompanyExist(companyId)) {
        const branch = await this.isBranchExist(branchId);
        if (branch) {
          await this.prisma.branch.delete({
            where: {
              id: branchId,
            },
          });
          return { isDeleted: true };
        } else {
          return customError(
            COMPANY_MESSAGE.BRANCH_NOT_FOUND,
            COMPANY_CODE.BRANCH_NOT_FOUND,
            STATUS_CODE.NOT_FOUND,
          );
        }
      } else {
        return customError(
          COMPANY_MESSAGE.NOT_FOUND,
          COMPANY_CODE.NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async updateAccountStatus(
    id: string,
    accountStatus,
    reason?: string,
  ): Promise<Company> {
    return await this.prisma.company.update({
      where: { id },
      data: {
        accountStatus,
        reason,
      },
    });
  }

  async companyAccountStatus(
    data: CompanyAccountStatus,
    id: string,
  ): Promise<CompanyPayload> {
    try {
      const company = await this.prisma.company.findFirst({ where: { id } });
      if (!company)
        return customError(
          COMPANY_MESSAGE.NOT_FOUND,
          COMPANY_CODE.NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );
      if (data.accountStatus === 'REJECTED') {
        if (!data.reason)
          return customError(
            COMPANY_MESSAGE.ACCOUNT_STATUS_REASON,
            COMPANY_CODE.ACCOUNT_STATUS_REASON,
            STATUS_CODE.BAD_CONFLICT,
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
      throw new Error(err);
    }
  }

  async uploadAvatar(id: string, avatar: FileUpload): Promise<CompanyPayload> {
    try {
      const companyData = await this.getCompanyById(id);
      if (!companyData)
        return customError(
          COMPANY_MESSAGE.NOT_FOUND,
          COMPANY_CODE.NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );

      let fileUrl;
      if (avatar) {
        if (companyData.avatar) {
          await this.fileUploadService.deleteImage(
            'company-avatar',
            this.cloudinary.getPublicId(companyData.avatar),
          );
        }
        fileUrl = await this.fileUploadService.uploadImage(
          'company-avatar',
          avatar,
        );
        /**check if error exist */
        if (fileUrl.errors) return { errors: fileUrl.errors };
      }

      const updatedAvatar = await this.prisma.company.update({
        where: { id },
        data: {
          avatar: fileUrl,
        },
      });
      return { company: updatedAvatar };
    } catch (err) {
      throw new Error(err);
    }
  }

  async getCompanyDocument(companyId: string): Promise<CompanyDocument[]> {
    try {
      return await this.prisma.companyDocument.findMany({
        where: { companyId },
      });
    } catch (err) {
      throw new Error(err);
    }
  }
  async getCompanyDocumentById(id: string): Promise<CompanyDocument> {
    try {
      return await this.prisma.companyDocument.findFirst({
        where: { id },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async companyDocument(
    input: CompanyDocumentInput,
    document: FileUpload[],
  ): Promise<CompanyPayload> {
    try {
      const companyData = await this.getCompanyById(input.companyId);
      if (!companyData)
        return customError(
          COMPANY_MESSAGE.NOT_FOUND,
          COMPANY_CODE.NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );
      if (!document)
        return customError(
          FILE_MESSAGE.REQUIRED,
          FILE_CODE.REQUIRED,
          STATUS_CODE.BAD_CONFLICT,
        );
      const documentUrl = await this.fileUploadService.uploadImage(
        'company-document',
        document,
      );
      /**check if error exist */
      if (documentUrl[0].errors) return { errors: documentUrl[0].errors };
      const companyDocument = await Promise.all(
        documentUrl.map(async (document) => {
          return await this.prisma.companyDocument.create({
            data: {
              ...input,
              document,
            },
          });
        }),
      );

      return { companyDocument, company: companyData };
    } catch (err) {
      throw new Error(err);
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
        return customError(
          COMPANY_MESSAGE.NOT_FOUND,
          COMPANY_CODE.NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );

      const companyDocument = await this.getCompanyDocumentById(documentId);
      if (!companyDocument)
        return customError(
          COMPANY_MESSAGE.COMPANY_DOCUMENT_NOT_FOUND,
          COMPANY_CODE.COMPANY_DOCUMENT_NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );
      const updateDocument = await this.prisma.$transaction(async () => {
        let updatedDocumentURL: any;
        if (document) {
          await this.fileUploadService.deleteImage(
            'company-document',
            await this.cloudinary.getPublicId(companyDocument.document),
          );
          updatedDocumentURL = await this.fileUploadService.uploadImage(
            'company-document',
            document,
          );
          if (updatedDocumentURL.errors)
            return { errors: updatedDocumentURL.errors };
        }
        const update = await this.prisma.companyDocument.update({
          where: { id: documentId },
          data: {
            ...editDocument,
            document: updatedDocumentURL,
          },
        });
        return { update };
      });
      return {
        companyDocument: updateDocument.update,
        errors: updateDocument.errors,
      };
    } catch (err) {
      throw new Error(err);
    }
  }
}
