import { Field, InputType, registerEnumType } from '@nestjs/graphql';

import { Order } from 'src/modules/prisma/resolvers/order/order';

export enum UsersOrderBy {
  username = 'username',
  createdAt = 'createdAt',
  email = 'email',
}

const orderBy: Array<string> = Object.values(UsersOrderBy);
const description = `Order by: ${orderBy.map((e) => e).join(', ')}`;

registerEnumType(UsersOrderBy, {
  name: 'UsersOrderBy',
  description,
});

@InputType()
export class OrderListUsers extends Order {
  @Field(() => UsersOrderBy)
  orderBy: UsersOrderBy;
}
