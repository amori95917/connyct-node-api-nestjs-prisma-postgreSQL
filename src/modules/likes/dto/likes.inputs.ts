import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class LikesInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  postId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  reactionId: string;
}
