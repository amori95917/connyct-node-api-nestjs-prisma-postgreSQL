import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class FollowUserToUserInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  followedToID: string;
}
