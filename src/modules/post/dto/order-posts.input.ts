import { Field, InputType, registerEnumType } from '@nestjs/graphql';

import { Order } from 'src/modules/prisma/resolvers/order/order';

export enum PostsOrderBy {
  createdAt = 'createdAt',
}

const orderBy: Array<string> = Object.values(PostsOrderBy);
const description = `Order by: ${orderBy.map((e) => e).join(', ')}`;

registerEnumType(PostsOrderBy, {
  name: 'PostsOrderBy',
  description,
});

@InputType()
export class OrderPosts extends Order {
  @Field(() => PostsOrderBy)
  orderBy: PostsOrderBy;
}
