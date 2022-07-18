import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class FollowUserToUserInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  followedToID: string;
}
