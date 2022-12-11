import { Field, InputType, registerEnumType } from '@nestjs/graphql';

import { Order } from 'src/modules/prisma/resolvers/order/order';

export enum CommunityPostsOrderBy {
  createdAt = 'createdAt',
}

const orderBy: Array<string> = Object.values(CommunityPostsOrderBy);
const description = `Order by: ${orderBy.map((e) => e).join(', ')}`;

registerEnumType(CommunityPostsOrderBy, {
  name: 'CommunityPostsOrderBy',
  description,
});

@InputType()
export class CommunityPostsOrderList extends Order {
  @Field(() => CommunityPostsOrderBy)
  orderBy: CommunityPostsOrderBy;
}
