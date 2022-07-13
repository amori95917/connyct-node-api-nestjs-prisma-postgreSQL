import { FileUpload } from 'graphql-upload';
import { Field, InputType, Scalar } from '@nestjs/graphql';
import {
  ArrayUnique,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Stream } from 'stream';
import { type } from 'os';
/**
 * Create post input object type.
 */

@InputType()
export class CreatePostInput {
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  text: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  @MaxLength(50, { each: true })
  @ArrayUnique()
  tags?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(3)
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(10)
  description: string;

  @Field()
  @IsNotEmpty()
  companyId: string;
}
