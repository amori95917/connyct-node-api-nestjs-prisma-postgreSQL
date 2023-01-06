import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { Order } from 'src/modules/prisma/resolvers/order/order';

export enum ProductOrderBy {
  createdAt = 'createdAt',
}

const orderBy: Array<string> = Object.values(ProductOrderBy);
const description = `Order by:${orderBy.map((e) => e).join(', ')}`;

registerEnumType(ProductOrderBy, {
  name: 'ProductOrderBy',
  description,
});

@InputType()
export class OrderListProduct extends Order {
  @Field(() => ProductOrderBy)
  orderBy: ProductOrderBy;
}
