import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Order } from 'src/modules/prisma/resolvers/order/order';
import { Reactions } from '../enum/reactions.enum';

@InputType()
export class LikesInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  postId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  reactionType: Reactions;
}

export enum ReactionsOrderBy {
  createdAt = 'createdAt',
}
const orderBy: Array<string> = Object.values(ReactionsOrderBy);
const description = `Order By:${orderBy.map((r) => r).join(',')}`;
registerEnumType(ReactionsOrderBy, {
  name: 'ReactionsOrderBy',
  description,
});

@InputType()
export class ReactionsOrderList extends Order {
  @Field(() => ReactionsOrderBy)
  orderBy: ReactionsOrderBy;
}
