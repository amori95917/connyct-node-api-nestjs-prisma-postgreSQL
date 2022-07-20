import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

@InputType()
export class IndustryInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @Length(3, 35, {
    message: 'Industry type must be between 3 to 35 characters long',
  })
  type: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Description must be at least 8 characters long' })
  description: string;
}
