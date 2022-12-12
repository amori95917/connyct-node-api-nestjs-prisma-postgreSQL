import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Order } from 'src/modules/prisma/resolvers/order/order';

@InputType()
export class CommentInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  public text!: string;
}

@InputType()
export class MentionsInput {
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  mentionIds: string[];
}

export enum CommunityPostCommentOrderBy {
  createdAt = 'createdAt',
}
const orderBy: Array<string> = Object.values(CommunityPostCommentOrderBy);
const description = `Order by:${orderBy.map((o) => o).join(',')}`;
registerEnumType(CommunityPostCommentOrderBy, {
  name: 'CommunityPostCommentOrderBy',
  description,
});
@InputType()
export class OrderCommentList extends Order {
  @Field(() => CommunityPostCommentOrderBy)
  orderBy: CommunityPostCommentOrderBy;
}
