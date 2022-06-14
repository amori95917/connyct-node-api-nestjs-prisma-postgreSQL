import { IsNotEmpty } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UnfollowUserInput {
  @Field()
  @IsNotEmpty()
  userId: string;
}
