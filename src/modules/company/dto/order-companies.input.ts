import { Field, InputType, registerEnumType } from '@nestjs/graphql';

import { Order } from 'src/modules/prisma/resolvers/order/order';

export enum CompaniesOrderBy {
  legalName = 'legalName',
  createdAt = 'createdAt',
}

const orderBy: Array<string> = Object.values(CompaniesOrderBy);
const description = `Order by: ${orderBy.map((e) => e).join(', ')}`;

registerEnumType(CompaniesOrderBy, {
  name: 'CompaniesOrderBy',
  description,
});

@InputType()
export class OrderListCompanies extends Order {
  @Field(() => CompaniesOrderBy)
  orderBy: CompaniesOrderBy;
}
