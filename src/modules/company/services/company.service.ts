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

@Injectable({ scope: Scope.REQUEST })
export class CompanyService {
  private allowOperation: boolean;

  constructor(
    @Inject(REQUEST) private request,
    @Inject(CONTEXT) private context,
    private prisma: PrismaService,
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
    paginate: PaginationArgs,
    order: OrderListCompanies,
    filter?: FilterListCompanies,
    companyids?: string[],
  ) {
    try {
      const nodes = await this.prisma.company.findMany({
        skip: paginate.skip,
        take: paginate.take,
        orderBy: { [order.orderBy]: order.direction },
        where: {
          ...(filter?.omni && {
            name: { contains: filter.omni, mode: 'insensitive' },
          }),
          id: {
            notIn: companyids,
          },
        },
      });
      await Promise.all(
        nodes.map(async (company) => {
          const followers = await this.getCompanyFollowersCount(company.id);
          Object.assign(company, { followers });
        }),
      );
      const totalCount = await this.prisma.company.count({});
      const hasNextPage = haveNextPage(
        paginate.skip,
        paginate.take,
        totalCount,
      );
      return {
        nodes,
        totalCount,
        hasNextPage,
        edges: nodes?.map((node) => ({
          node,
          cursor: Buffer.from(node.id).toString('base64'),
        })),
      };
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
  ): Promise<Company> {
    try {
      const companyData = await this.prisma.company.findFirst({
        where: { id: companyId },
      });
      if (!companyData) throw new Error('Company does not exist');
      const updatedData = await this.prisma.company.update({
        where: { id: companyId },
        data: {
          ...companyEditData,
          // branches: companyEditData.b as any,
        },
      });
      return updatedData;
    } catch (e) {
      throw new Error(e);
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
