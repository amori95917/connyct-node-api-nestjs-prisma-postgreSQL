import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

@InputType()
export class CompanyDiscussionInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => sanitizeHtml(value))
  description: string;

  @Field()
  @IsNotEmpty()
  @IsUUID()
  companyId: string;
}

@InputType()
export class CompanyDiscussionUpdateInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => sanitizeHtml(value))
  description: string;
}
