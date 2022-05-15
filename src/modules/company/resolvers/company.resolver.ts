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

@Resolver(() => Company)
export class CompanyResolver {
  constructor(private readonly companyService: CompanyService) {}

  @Roles(Role.Owner)
  @Query(() => CompanyPaginated)
  async companies(
    @Args('paginate', { nullable: true, defaultValue: { skip: 0, take: 50 } })
    paginate: PaginationArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { orderBy: 'username', direction: 'desc' },
    })
    order: OrderListCompanies,
    @Args('filter', { nullable: true })
    filter: FilterListCompanies,
  ) {
    return await this.companyService.list(paginate, order, filter);
  }
}
