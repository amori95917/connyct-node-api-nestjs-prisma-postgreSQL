import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { Order } from 'src/modules/prisma/resolvers/order/order';

export enum CommunityOrderBy {
  createdAt = 'createdAt',
  name = 'name',
}

const orderBy: Array<string> = Object.values(CommunityOrderBy);
const description = `Order by:${orderBy.map((e) => e).join(', ')}`;

registerEnumType(CommunityOrderBy, {
  name: 'CommunityOrderBy',
  description,
});

@InputType()
export class OrderListCommunity extends Order {
  @Field(() => CommunityOrderBy)
  orderBy: CommunityOrderBy;
}
