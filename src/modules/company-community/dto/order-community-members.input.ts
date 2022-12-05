import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { Order } from 'src/modules/prisma/resolvers/order/order';

export enum CommunityMemberOrderBy {
  createdAt = 'createdAt',
}

const orderBy: Array<string> = Object.values(CommunityMemberOrderBy);
const description = `Order by:${orderBy.map((e) => e).join(', ')}`;

registerEnumType(CommunityMemberOrderBy, {
  name: 'CommunityMemberOrderBy',
  description,
});

@InputType()
export class OrderListCommunityMember extends Order {
  @Field(() => CommunityMemberOrderBy)
  orderBy: CommunityMemberOrderBy;
}
