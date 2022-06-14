import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class FollowCompanyInput {
  @Field()
  @IsNotEmpty()
  followedToId: string;
}
