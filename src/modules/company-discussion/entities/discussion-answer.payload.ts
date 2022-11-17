import { Field, ObjectType } from '@nestjs/graphql';
import { CustomError } from 'src/common/graphql/types/custom-error';
import { DiscussionAnswer } from './discussion-answer.entity';

@ObjectType()
export class DiscussionAnswerPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => DiscussionAnswer, { nullable: true })
  discussionAnswer?: DiscussionAnswer;
}

@ObjectType()
export class DiscussionAnswerDeletePayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => Boolean, { nullable: true })
  isDeleted?: boolean;
}
