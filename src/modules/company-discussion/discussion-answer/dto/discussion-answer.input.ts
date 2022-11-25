import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

@InputType()
export class DiscussionAnswerInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => sanitizeHtml(value))
  answer: string;

  @Field()
  @IsNotEmpty()
  @IsUUID()
  discussionId: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  mentionIds: string[];
}

@InputType()
export class DiscussionAnswerUpdateInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => sanitizeHtml(value))
  answer: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  mentionIds: string[];
}

@InputType()
export class ReplyToAnswerInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  repliedToAnswerId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => sanitizeHtml(value))
  answer: string;

  @Field()
  @IsNotEmpty()
  @IsUUID()
  discussionId: string;
}
