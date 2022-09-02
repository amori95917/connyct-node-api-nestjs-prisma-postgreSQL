import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { Order } from 'src/modules/prisma/resolvers/order/order';

export enum TagOrderBy {
  name = 'name',
}
// const orderBy: Array<string> = Object.values(TagOrderBy);
// const description = `Order by:${orderBy.map((o) => o).join(',')}`;
registerEnumType(TagOrderBy, {
  name: 'TagOrderBy',
});
@InputType()
export class OrderTagList extends Order {
  @Field(() => TagOrderBy)
  orderBy: TagOrderBy;
}
