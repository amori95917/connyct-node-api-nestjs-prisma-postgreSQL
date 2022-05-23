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
 * Create post input object type.
 */
@InputType()
export class CreatePostInput {
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  text: string;

  @IsOptional()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  @MaxLength(50, { each: true })
  @ArrayUnique()
  @Field(() => [String], { nullable: true })
  tags?: string[];
}
