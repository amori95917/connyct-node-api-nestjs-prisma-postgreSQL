import { FileUpload } from 'graphql-upload';
import { Field, InputType, Scalar } from '@nestjs/graphql';
import {
  ArrayUnique,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
/**
 * Create post input object type.
 */

@InputType()
export class CreatePostInput {
  @Field(() => String, { nullable: false })
  @IsOptional()
  @IsString()
  @Length(3, 75, { message: 'Text must be between 3 and 75 characters' })
  text: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  @MaxLength(50, { each: true })
  @ArrayUnique()
  tags?: string[];

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  metaTitle: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description: string;
}
