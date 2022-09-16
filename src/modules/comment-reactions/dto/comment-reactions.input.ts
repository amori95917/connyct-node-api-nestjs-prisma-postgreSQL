import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { Reactions } from 'src/modules/likes/enum/reactions.enum';
import { Order } from 'src/modules/prisma/resolvers/order/order';

@InputType()
export class CommentReactionsInput {
  @Field()
  @IsNotEmpty()
  reactionType: Reactions;

  @Field()
  @IsNotEmpty()
  @IsUUID()
  commentId: string;
}

export enum CommentReactionsOrderBy {
  createdAt = 'createdAt',
}
const orderBy: Array<string> = Object.values(CommentReactionsOrderBy);
const description = `Order by:${orderBy.map((o) => o).join(',')}`;
registerEnumType(CommentReactionsOrderBy, {
  name: 'CommentReactionsOrderBy',
  description,
});

@InputType()
export class CommentReactionsOrderList extends Order {
  @Field(() => CommentReactionsOrderBy, { nullable: true })
  orderBy: CommentReactionsOrderBy;
}
