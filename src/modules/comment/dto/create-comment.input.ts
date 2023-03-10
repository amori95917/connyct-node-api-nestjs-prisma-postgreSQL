import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Order } from 'src/modules/prisma/resolvers/order/order';

@InputType()
export class PostCommentInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  public content!: string;
}

@InputType()
export class PostMentionsInput {
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  mentionIds: string[];
}

export enum CommentOrderBy {
  createdAt = 'createdAt',
}
const orderBy: Array<string> = Object.values(CommentOrderBy);
const description = `Order by:${orderBy.map((o) => o).join(',')}`;
registerEnumType(CommentOrderBy, {
  name: 'CommentOrderBy',
  description,
});
@InputType()
export class OrderCommentsList extends Order {
  @Field(() => CommentOrderBy)
  orderBy: CommentOrderBy;
}
