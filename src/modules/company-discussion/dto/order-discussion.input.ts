import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { Order } from 'src/modules/prisma/resolvers/order/order';

export enum DiscussionOrderBy {
  createdAt = 'createdAt',
}

const orderBy: Array<string> = Object.values(DiscussionOrderBy);
const description = `Order by:${orderBy.map((e) => e).join(', ')}`;

registerEnumType(DiscussionOrderBy, {
  name: 'DiscussionOrderBy',
  description,
});

@InputType()
export class OrderListDiscussion extends Order {
  @Field(() => DiscussionOrderBy)
  orderBy: DiscussionOrderBy;
}
