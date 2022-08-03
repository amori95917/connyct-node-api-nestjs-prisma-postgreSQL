import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Order } from 'src/modules/prisma/resolvers/order/order';

@InputType()
export class FollowCompanyInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  followedToId: string;
}
export enum FollowedCompanyOrderBy {
  createdAt = 'createdAt',
}
const orderBy: Array<string> = Object.values(FollowedCompanyOrderBy);
const description = `Order by: ${orderBy.map((e) => e).join(', ')}`;
registerEnumType(FollowedCompanyOrderBy, {
  name: 'FollowedCompanyOrderBy',
  description,
});

@InputType()
export class OrderFollowedCompanyList extends Order {
  @Field(() => FollowedCompanyOrderBy)
  orderBy: FollowedCompanyOrderBy;
}
