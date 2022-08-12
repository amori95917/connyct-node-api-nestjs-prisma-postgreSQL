import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Company as CompanyPrisma } from '@prisma/client';

import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';
import { Roles } from 'src/modules/auth/decorators/role.decorator';
import { Role } from 'src/modules/auth/enum/role.enum';
import { Company, CompanyPaginated } from '../entities/company.entity';
import { CompanyService } from '../services/company.service';
import { OrderListCompanies } from '../dto/order-companies.input';
import { FilterListCompanies } from '../dto/filter-company.input';
import {
  CreateCompanyGeneralInput,
  CreateCompanyInput,
  CreateCompanyAddressInput,
} from '../dto/company-input';
import { CompanyEditInput } from '../dto/company-edit-input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';

@Resolver(() => Company)
export class CompanyResolver {
  constructor(private readonly companyService: CompanyService) {}

  // @Roles(Role.Admin)
  @Query(() => CompanyPaginated)
  async companies(
    @Args('paginate', { nullable: true, defaultValue: { skip: 0, take: 50 } })
    paginate: PaginationArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { orderBy: 'name', direction: 'desc' },
    })
    order: OrderListCompanies,
    @Args('filter', { nullable: true })
    filter: FilterListCompanies,
  ) {
    return await this.companyService.list(paginate, order, filter);
  }

  @Roles(Role.Owner)
  @Query(() => Company)
  async getCompanyById(@Args('id', { type: () => String }) id: string) {
    return this.companyService.getCompanyById(id);
  }
  @UseGuards(GqlAuthGuard)
  @Roles(Role.Owner)
  @Mutation(() => Company)
  async createCompany(
    @Args('data')
    company: CreateCompanyInput,
  ): Promise<CompanyPrisma> {
    return this.companyService.createCompany(company);
  }

  @Roles(Role.Owner)
  @Mutation(() => Company)
  async createCompanyGeneralInfo(
    @Args('data')
    generalCompany: CreateCompanyGeneralInput,
  ): Promise<CompanyPrisma> {
    return this.companyService.createCompanyGeneralInfo(generalCompany);
  }

  @Roles(Role.Owner)
  @Mutation(() => Company)
  async createCompanyAddress(
    @Args('data') companyAddress: CreateCompanyAddressInput,
  ): Promise<CompanyPrisma> {
    return this.companyService.createCompanyAddress(companyAddress);
  }
  @Roles(Role.Owner)
  @Mutation(() => Company)
  async editCompany(
    @Args('id') companyId: string,
    @Args('data') companyEditData: CompanyEditInput,
  ): Promise<Company> {
    return this.companyService.editCompany(companyId, companyEditData);
  }
}
