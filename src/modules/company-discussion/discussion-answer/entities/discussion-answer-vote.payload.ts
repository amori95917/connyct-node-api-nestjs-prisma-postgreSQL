import { Field, ObjectType } from '@nestjs/graphql';
import { CustomError } from 'src/common/graphql/types/custom-error';
import { DiscussionAnswerVote } from './discussion-answer-vote.entity';

@ObjectType()
export class DiscussionAnswerVotePayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => DiscussionAnswerVote, { nullable: true })
  discussionAnswerVote?: DiscussionAnswerVote;

  @Field({ nullable: true })
  removeVote?: boolean;
}
