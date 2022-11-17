import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { Order } from 'src/modules/prisma/resolvers/order/order';

export enum DiscussionAnswerOrderBy {
  createdAt = 'createdAt',
}

const orderBy: Array<string> = Object.values(DiscussionAnswerOrderBy);
const description = `Order by:${orderBy.map((e) => e).join(', ')}`;

registerEnumType(DiscussionAnswerOrderBy, {
  name: 'DiscussionAnswerOrderBy',
  description,
});

@InputType()
export class OrderListDiscussionAnswer extends Order {
  @Field(() => DiscussionAnswerOrderBy)
  orderBy: DiscussionAnswerOrderBy;
}
