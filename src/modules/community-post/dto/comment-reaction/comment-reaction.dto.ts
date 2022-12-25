import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { ReactionsType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { Order } from 'src/modules/prisma/resolvers/order/order';

@InputType()
export class CommunityPostCommentReactionInput {
  @Field()
  @IsNotEmpty()
  @IsEnum(ReactionsType)
  reactionType: ReactionsType;

  @Field()
  @IsNotEmpty()
  @IsUUID()
  communityPostCommentId: string;
}

@InputType()
export class ReactionTypeInput {
  @Field()
  @IsNotEmpty()
  @IsEnum(ReactionsType)
  reactionType: ReactionsType;
}

export enum CommunityPostCommentReactionsOrderBy {
  createdAt = 'createdAt',
}
const orderBy: Array<string> = Object.values(
  CommunityPostCommentReactionsOrderBy,
);
const description = `Order By:${orderBy.map((r) => r).join(',')}`;
registerEnumType(CommunityPostCommentReactionsOrderBy, {
  name: 'CommunityPostCommentReactionsOrderBy',
  description,
});

@InputType()
export class CommunityPostCommentReactionsOrderList extends Order {
  @Field(() => CommunityPostCommentReactionsOrderBy)
  orderBy: CommunityPostCommentReactionsOrderBy;
}
