import { Field, InputType } from '@nestjs/graphql';
import {
  ArrayUnique,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Update post input type.
 */
@InputType()
export class UpdatePostInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
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

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(3, 35, { message: 'Name must be between 3 to 35 characters ' })
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Description must be atleast 8 characters long' })
  description: string;
}
