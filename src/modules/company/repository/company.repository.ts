import { Inject, Injectable } from '@nestjs/common';
import { ApolloError } from 'apollo-server-express';
import { CloudinaryService } from 'src/modules/cloudinary/services/cloudinary.service';
import { FileUploadService } from 'src/modules/files/services/file.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { findManyCursorConnection } from 'src/modules/prisma/resolvers/pagination/relay.pagination';
import { OrderListCompanies } from '../dto/order-companies.input';
import { FilterListCompanies } from '../dto/filter-company.input';
import { Company } from '../entities/company.entity';
import { REQUEST } from '@nestjs/core';
import { CONTEXT } from '@nestjs/graphql';
import { CompanyEditInput } from '../dto/company-edit-input';
import {
  CompanyDocumentEditPayload,
  CompanyPayload,
} from '../entities/company.payload';
import { AccountStatus, BranchType } from '@prisma/client';
import { CompanyBranchInput } from '../dto/company-branch.input';
import {
  CompanyBranchDeletePayload,
  CompanyBranchPayload,
  GetCompanyBranchPayload,
} from '../entities/company-branch.payload';
import { CompanyBranchEditInput } from '../dto/company-branch-edit.input';
import { CompanyAccountStatus } from '../dto/company-account-status.input';
import { FileUpload } from 'graphql-upload';
import {
  CompanyDocumentEditInput,
  CompanyDocumentInput,
} from '../dto/company-document.input';
import { CompanyDocument } from '../entities/company-document.entity';

@Injectable()
export class CompanyRepository {
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
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async findCompany(id: string) {
    return await this.prisma.company.findFirst({
      where: {
        id,
      },
    });
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
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
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

  async editCompany(
    companyId: string,
    companyEditData: CompanyEditInput,
    companyData: any,
  ): Promise<CompanyPayload> {
    try {
      const updatedData = await this.prisma.company.update({
        where: { id: companyId },
        data: {
          ...companyData,
          ...companyEditData,
          accountStatus: AccountStatus.REVIEW,
        },
      });
      return { company: updatedData };
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
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
    const branch = await this.prisma.branch.create({
      data: { ...branchInput, companyId },
    });
    return { branch };
  }

  async getBranchesByCompanyId(
    companyId: string,
  ): Promise<GetCompanyBranchPayload> {
    try {
      const branches = await this.prisma.branch.findMany({
        where: { companyId },
      });
      return { branches };
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async editCompanyBranch(
    branchId: string,
    branchEditInput: CompanyBranchEditInput,
    branch: any,
  ): Promise<CompanyBranchPayload> {
    try {
      const editedBranch = await this.prisma.branch.update({
        where: { id: branchId },
        data: { ...branch, ...branchEditInput },
      });
      return { branch: editedBranch };
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async deleteCompanyBranch(
    branchId: string,
  ): Promise<CompanyBranchDeletePayload> {
    try {
      await this.prisma.branch.delete({
        where: {
          id: branchId,
        },
      });
      return { isDeleted: true };
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
    return await this.prisma.company.update({
      where: { id },
      data: {
        accountStatus,
        reason,
      },
    });
  }

  async uploadAvatar(
    id: string,
    avatar: FileUpload,
    companyData: any,
  ): Promise<CompanyPayload> {
    try {
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
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async getCompanyDocument(companyId: string): Promise<CompanyDocument[]> {
    try {
      return await this.prisma.companyDocument.findMany({
        where: { companyId },
      });
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
  async getCompanyDocumentById(id: string): Promise<CompanyDocument> {
    try {
      return await this.prisma.companyDocument.findFirst({
        where: { id },
      });
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async companyDocument(
    input: CompanyDocumentInput,
    document: FileUpload[],
    companyData: any,
  ): Promise<CompanyPayload> {
    try {
      const documentUrl = await this.fileUploadService.uploadImage(
        'company-document',
        document,
      );
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
    companyDocument: any,
  ): Promise<CompanyDocumentEditPayload> {
    try {
      const updateDocument = await this.prisma.$transaction(async (prisma) => {
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
        }
        const update = await prisma.companyDocument.update({
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
      };
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
}
