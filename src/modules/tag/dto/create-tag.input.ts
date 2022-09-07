import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { Order } from 'src/modules/prisma/resolvers/order/order';

export enum TagOrderBy {
  createdAt = 'createdAt',
}
const orderBy: Array<string> = Object.values(TagOrderBy);
const description = `Order by:${orderBy.map((o) => o).join(',')}`;
registerEnumType(TagOrderBy, {
  name: 'TagOrderBy',
  description,
});
@InputType()
export class OrderTagList extends Order {
  @Field(() => TagOrderBy)
  orderBy: TagOrderBy;
}
