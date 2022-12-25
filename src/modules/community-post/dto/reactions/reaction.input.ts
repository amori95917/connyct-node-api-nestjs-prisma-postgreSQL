import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { ReactionsType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Order } from 'src/modules/prisma/resolvers/order/order';

@InputType()
export class ReactionInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  postId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @IsEnum(ReactionsType)
  reactionType: ReactionsType;
}

export enum CommunityPostReactionsOrderBy {
  createdAt = 'createdAt',
}
const orderBy: Array<string> = Object.values(CommunityPostReactionsOrderBy);
const description = `Order By:${orderBy.map((r) => r).join(',')}`;
registerEnumType(CommunityPostReactionsOrderBy, {
  name: 'CommunityPostReactionsOrderBy',
  description,
});

@InputType()
export class CommunityPostReactionsOrderList extends Order {
  @Field(() => CommunityPostReactionsOrderBy)
  orderBy: CommunityPostReactionsOrderBy;
}
