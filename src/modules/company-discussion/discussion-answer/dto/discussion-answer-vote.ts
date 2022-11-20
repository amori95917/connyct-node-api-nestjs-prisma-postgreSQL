import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

enum Vote {
  UPVOTE = 'UPVOTE',
  DOWNVOTE = 'DOWNVOTE',
}

@InputType()
export class DiscussionAnswerVoteInput {
  @Field()
  @IsNotEmpty()
  @IsUUID()
  discussionId: string;

  @Field()
  @IsNotEmpty()
  @IsUUID()
  discussionAnswerId: string;

  @Field()
  @IsNotEmpty()
  @IsEnum(Vote)
  vote: Vote;
}
