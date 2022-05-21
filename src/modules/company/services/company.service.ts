import { Inject, Injectable, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { REQUEST } from '@nestjs/core';

import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';
import { haveNextPage } from 'src/modules/prisma/resolvers/pagination/pagination';
import { FilterListCompanies } from '../dto/filter-company.input';
import { OrderListCompanies } from '../dto/order-companies.input';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateCompanyAddressInput,
  CreateCompanyGeneralInput,
  CreateCompanyInput,
} from '../dto/company-input';
import { Prisma } from '@prisma/client';

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
  ) {
    const nodes = await this.prisma.company.findMany({
      skip: paginate.skip,
      take: paginate.take,
      orderBy: { [order.orderBy]: order.direction },
      where: {
        ...(filter?.omni && {
          name: { contains: filter.omni, mode: 'insensitive' },
        }),
      },
    });
    const totalCount = await this.prisma.company.count({});
    const hasNextPage = haveNextPage(paginate.skip, paginate.take, totalCount);
    return {
      nodes,
      totalCount,
      hasNextPage,
      edges: nodes?.map((node) => ({
        node,
        cursor: Buffer.from(node.id).toString('base64'),
      })),
    };
  }

  async createCompany(company: CreateCompanyInput) {
    return await this.prisma.company.create({
      data: {
        ...company,
        employees: { create: { employeeId: this.request?.user?.id } },
      },
    });
  }

  async createCompanyGeneralInfo(generalCompany: Prisma.CompanyCreateInput) {
    console.log('generalCompany', generalCompany);
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
    console.log('generalCompany', companyAddress);
    return await this.prisma.company.findFirst();
  }
}