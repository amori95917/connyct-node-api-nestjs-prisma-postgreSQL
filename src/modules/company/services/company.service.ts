import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';

import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';
import { FilterListCompanies } from '../dto/filter-company.input';
import { OrderListCompanies } from '../dto/order-companies.input';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable({ scope: Scope.REQUEST })
export class CompanyService {
  private allowOperation: boolean;

  constructor(@Inject(CONTEXT) private context, private prisma: PrismaService) {
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
    console.log(paginate, order, filter);
  }
}
