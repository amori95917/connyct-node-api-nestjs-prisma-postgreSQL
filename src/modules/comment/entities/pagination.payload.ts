import { Field, ObjectType } from '@nestjs/graphql';
import { UserError } from 'src/common/graphql/types/user-error';
import { CommentPagination } from '../comment.models';

@ObjectType()
export class CommentPaginationPayload {
  @Field(() => [UserError], { nullable: true })
  errors?: UserError[];

  @Field(() => CommentPagination, { nullable: true })
  comments?: CommentPagination;
}
