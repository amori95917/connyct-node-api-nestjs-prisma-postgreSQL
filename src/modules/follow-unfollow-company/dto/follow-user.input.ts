import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class FollowUserToUserInput {
  @Field()
  @IsNotEmpty()
  followedToID: string;
}
