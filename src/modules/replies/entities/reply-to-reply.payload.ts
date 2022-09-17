import { Field, ObjectType } from '@nestjs/graphql';
import { CustomError } from 'src/common/graphql/types/custom-error';
import { RepliesToReplies } from '../replies-to-replies.model';

@ObjectType()
export class RepliesToRepliesPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => RepliesToReplies, { nullable: true })
  replies?: RepliesToReplies;
}
