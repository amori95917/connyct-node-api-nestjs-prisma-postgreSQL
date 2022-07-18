import { FileUpload } from 'graphql-upload';
import { Field, InputType, Scalar } from '@nestjs/graphql';
import {
  ArrayUnique,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
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
  @IsString()
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
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(10)
  @IsString()
  description: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  companyId: string;
}
