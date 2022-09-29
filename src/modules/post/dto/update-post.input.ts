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
  @Field(() => String, { nullable: false })
  @IsOptional()
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
  metaTitle: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description: string;
}
