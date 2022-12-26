import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
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
} from '../dto/company-input';
import { CompanyEditInput } from '../dto/company-edit-input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import { Branch } from '../entities/branch.entity';
import { CompanyBranchInput } from '../dto/company-branch.input';
import { CompanyBranchEditInput } from '../dto/company-branch-edit.input';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import {
  CompanyDocumentEditPayload,
  CompanyPayload,
} from '../entities/company.payload';
import { CompanyAccountStatus } from '../dto/company-account-status.input';
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
import { UserDecorator } from 'src/modules/user/decorators/user.decorator';
import { User } from 'src/modules/user/entities/user.entity';

@Resolver(() => Company)
export class CompanyResolver {
  constructor(private readonly companyService: CompanyService) {}

  // @Roles(Role.Admin)
  @Query(() => CompanyPaginated)
  async companies(
    @Args() paginate: ConnectionArgs,
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

  @UseGuards(GqlAuthGuard)
  @Roles(Role.Owner, Role.Manager, Role.Editor, Role.User)
  @Query(() => Company)
  async getCompanyById(
    @Args('id', { type: () => String }) id: string,
    @UserDecorator() user: User,
  ) {
    return this.companyService.getCompanyById(id, user.id);
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

  // @Roles(Role.Owner)
  // @Mutation(() => Company)
  // async createCompanyAddress(
  //   @Args('data') companyAddress: CreateCompanyAddressInput,
  // ): Promise<CompanyPrisma> {
  //   return this.companyService.createCompanyAddress(companyAddress);
  // }
  @Roles(Role.Owner, Role.Manager)
  @Mutation(() => CompanyPayload)
  async companyGeneralInfoEdit(
    @Args('companyId') companyId: string,
    @Args('data') companyEditData: CompanyEditInput,
  ): Promise<CompanyPayload> {
    return this.companyService.editCompany(companyId, companyEditData);
  }

  @Roles(Role.Owner, Role.Manager)
  @Mutation(() => CompanyPayload)
  async companyAvatar(
    @Args('companyId') companyId: string,
    @Args('avatar', { type: () => GraphQLUpload }) avatar: FileUpload,
  ): Promise<CompanyPayload> {
    return await this.companyService.uploadAvatar(companyId, avatar);
  }

  @Roles(Role.Owner, Role.Manager)
  @Mutation(() => CompanyBranchPayload)
  async createCompanyBranch(
    @Args('id') companyId: string,
    @Args('data') branchInput: CompanyBranchInput,
  ): Promise<CompanyBranchPayload> {
    return this.companyService.createCompanyBranch(companyId, branchInput);
  }

  @Roles(Role.Owner, Role.Manager)
  @Query(() => GetCompanyBranchPayload)
  async getBranchesByCompanyId(
    @Args('id', { type: () => String }) companyId: string,
  ): Promise<GetCompanyBranchPayload> {
    return this.companyService.getBranchesByCompanyId(companyId);
  }

  @Roles(Role.Owner, Role.Manager)
  @Mutation(() => CompanyBranchPayload)
  async editCompanyBranch(
    @Args('id') branchId: string,
    @Args('data') branchEditInput: CompanyBranchEditInput,
  ): Promise<CompanyBranchPayload> {
    return this.companyService.editCompanyBranch(branchId, branchEditInput);
  }

  @Roles(Role.Owner, Role.Manager)
  @Mutation(() => CompanyBranchDeletePayload)
  async deleteCompanyBranch(
    @Args('id') branchId: string,
    @Args('companyId') companyId: string,
  ): Promise<CompanyBranchDeletePayload> {
    return this.companyService.deleteCompanyBranch(companyId, branchId);
  }

  @Roles(Role.Admin)
  @Mutation(() => CompanyPayload)
  async companyAccountStatus(
    @Args('data') data: CompanyAccountStatus,
    @Args('companyId') companyId: string,
  ): Promise<CompanyPayload> {
    return await this.companyService.companyAccountStatus(data, companyId);
  }

  @Roles(Role.Owner)
  @Mutation(() => CompanyPayload)
  async companyDocumentCreate(
    @Args('input') input: CompanyDocumentInput,
    @Args('document', { type: () => [GraphQLUpload] }) document: FileUpload[],
  ): Promise<CompanyPayload> {
    return await this.companyService.companyDocument(input, document);
  }

  @Roles(Role.Owner)
  @Mutation(() => CompanyDocumentEditPayload)
  async companyDocumentEdit(
    @Args('companyId') companyId: string,
    @Args('documentId') documentId: string,
    @Args('editDocument') editDocument: CompanyDocumentEditInput,
    @Args('document', { type: () => GraphQLUpload }) document: FileUpload,
  ): Promise<CompanyDocumentEditPayload> {
    return await this.companyService.editCompanyDocument(
      companyId,
      documentId,
      editDocument,
      document,
    );
  }

  @ResolveField('companyDocument', () => [CompanyDocument])
  async companyDocument(
    @Parent() company: Company,
  ): Promise<CompanyDocument[]> {
    const { id } = company;
    return await this.companyService.getCompanyDocument(id);
  }
}
