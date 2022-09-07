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
  @IsNotEmpty()
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
  @Length(3, 35, { message: 'Name must be between 3 to 35 characters ' })
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @MinLength(10)
  @IsString()
  @MinLength(8, { message: 'Description must be atleast 8 characters long' })
  description: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  companyId: string;
}
