import { CompanyEditInput } from './../dto/company-edit-input';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { REQUEST } from '@nestjs/core';

import { BranchType } from '@prisma/client';
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
import { CompanyPayload } from '../entities/company.payload';
import { customError } from 'src/common/errors';
import { COMPANY_MESSAGE } from 'src/common/errors/error.message';
import { COMPANY_CODE } from 'src/common/errors/error.code';
import { STATUS_CODE } from 'src/common/errors/error.statusCode';

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

  async getCompanyById(companyId: string): Promise<Company> {
    try {
      const company = await this.prisma.company.findFirst({
        where: { id: companyId },
      });
      if (!company) throw new Error('company not found');
      const followers = await this.getCompanyFollowersCount(companyId);
      return Object.assign(company, { followers });
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
    file: FileUpload,
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
      /**1. Image dimension check */
      let fileUrl;
      if (file) {
        if (companyData.avatar) {
          await this.fileUploadService.deleteImage(
            'company-avatar',
            this.cloudinary.getPublicId(companyData.avatar),
          );
        }
        fileUrl = await this.fileUploadService.uploadImage(
          'company-avatar',
          file,
        );
        /**check if error exist */
        if (fileUrl.errors) return { errors: fileUrl.errors };
      }

      const updatedData = await this.prisma.company.update({
        where: { id: companyId },
        data: {
          ...companyData,
          ...companyEditData,
          avatar: fileUrl,
        },
      });
      return { company: updatedData };
    } catch (e) {
      throw new Error(e);
    }
  }
  async getCompanyByUserId(userId: string): Promise<Company> {
    try {
      return await this.prisma.company.findFirst({
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
        type: BranchType.CORPORATE,
      },
    });
  }

  async isBranchExist(id: string) {
    return await this.prisma.branch.findFirst({
      where: { id },
    });
  }

  async createCompanyBranch(
    companyId: string,
    branchInput: CompanyBranchInput,
  ): Promise<Branch> {
    if (await this.isCompanyExist(companyId)) {
      const isHeadOfficeAlreadyExist =
        branchInput.type === BranchType.CORPORATE
          ? await this.isHeadOfficeAlreadyExist(companyId)
          : false;
      if (isHeadOfficeAlreadyExist)
        throw new Error('A company cannot have multiple corporate branch');
      console.log('branchInput', branchInput, typeof branchInput);
      const branch = await this.prisma.branch.create({
        data: { ...branchInput, companyId },
      });
      console.log('branch', branch);
      // return branch;
      return branch;
    } else {
      throw new Error('Company with that id does not exist');
    }
  }

  async getBranchesByCompanyId(companyId: string): Promise<Branch[] | []> {
    try {
      if (await this.isCompanyExist(companyId)) {
        const branches = await this.prisma.branch.findMany({
          where: { companyId },
        });
        return branches;
      } else {
        throw new Error('Company with that id does not exist');
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async editCompanyBranch(
    branchId: string,
    branchEditInput: CompanyBranchEditInput,
  ): Promise<Branch> {
    try {
      const branch = await this.isBranchExist(branchId);
      const isHeadOfficeAlreadyExist =
        branchEditInput.type === BranchType.CORPORATE
          ? await this.isHeadOfficeAlreadyExist(branch.companyId)
          : false;
      if (isHeadOfficeAlreadyExist)
        throw new Error('A company cannot have multiple corporate branch');
      const editedBranch = await this.prisma.branch.update({
        where: { id: branchId },
        data: { ...branchEditInput },
      });
      return editedBranch;
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteCompanyBranch(
    companyId: string,
    branchId: string,
  ): Promise<Branch> {
    try {
      if (await this.isCompanyExist(companyId)) {
        const branch = await this.isBranchExist(branchId);
        if (branch) {
          await this.prisma.branch.delete({
            where: {
              id: branchId,
            },
          });
          return branch;
        } else {
          throw new Error('Branch with that id does not exist');
        }
      } else {
        throw new Error('Company with that id does not exist');
      }
    } catch (e) {
      throw new Error(e);
    }
  }
}
