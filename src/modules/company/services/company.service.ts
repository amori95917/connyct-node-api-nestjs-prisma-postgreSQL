import { CompanyEditInput } from './../dto/company-edit-input';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { REQUEST } from '@nestjs/core';

import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';
import { haveNextPage } from 'src/modules/prisma/resolvers/pagination/pagination';
import { FilterListCompanies } from '../dto/filter-company.input';
import { OrderListCompanies } from '../dto/order-companies.input';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCompanyAddressInput } from '../dto/company-input';
import { Company } from '../entities/company.entity';

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
      return company;
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

  async createCompanyAddress(companyAddress: CreateCompanyAddressInput) {
    return await this.prisma.company.findFirst();
  }

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
          addresses: companyEditData.addresses as any,
        },
      });
      return updatedData;
    } catch (e) {
      throw new Error(e);
    }
  }
}
