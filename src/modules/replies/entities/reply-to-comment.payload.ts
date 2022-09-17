import { Field, ObjectType } from '@nestjs/graphql';
import { CustomError } from 'src/common/graphql/types/custom-error';
import { Replies } from '../replies.models';

@ObjectType()
export class ReplyToCommentPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => Replies, { nullable: true })
  replies?: Replies;
}
