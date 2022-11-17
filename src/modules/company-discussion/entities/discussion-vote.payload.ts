import { Field, ObjectType } from '@nestjs/graphql';
import { CustomError } from 'src/common/graphql/types/custom-error';
import { DiscussionVote } from './discussion-vote.entity';

@ObjectType()
export class DiscussionVotePayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => DiscussionVote, { nullable: true })
  discussionVote?: DiscussionVote;
}
