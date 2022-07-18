import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class FollowCompanyInput {
  @Field()
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  followedToId: string;
}
