import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

enum Vote {
  UPVOTE = 'UPVOTE',
  DOWNVOTE = 'DOWNVOTE',
}

@InputType()
export class DiscussionVoteInput {
  @Field()
  @IsNotEmpty()
  @IsUUID()
  discussionId: string;

  @Field()
  @IsNotEmpty()
  @IsEnum(Vote)
  vote: Vote;
}
