import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UnfollowUserInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string;
}
