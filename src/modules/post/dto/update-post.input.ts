import { Field, InputType } from '@nestjs/graphql';
import {
  ArrayUnique,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Update post input type.
 */
@InputType()
export class UpdatePostInput {
  @IsOptional()
  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  text: string;

  @IsOptional()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  @MaxLength(50, { each: true })
  @ArrayUnique()
  @Field(() => [String], { nullable: true })
  tags?: string[];
}
