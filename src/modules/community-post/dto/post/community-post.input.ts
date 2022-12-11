import { Field, InputType } from '@nestjs/graphql';
import {
  ArrayUnique,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class CommunityPostInput {
  @Field()
  @IsOptional()
  @IsString()
  text: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  communityId: string;

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

@InputType()
export class UpdateCommunityPostInput {
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
