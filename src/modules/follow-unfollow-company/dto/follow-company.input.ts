import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class FollowCompanyInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  followedToId: string;
}
