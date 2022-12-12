import { Field, InputType } from '@nestjs/graphql';
import { CommunityType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

@InputType()
export class CommunityInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @IsEnum(CommunityType)
  type: CommunityType;

  @Field()
  @IsNotEmpty()
  @IsUUID()
  companyId: string;
}

@InputType()
export class CommunityEditInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsEnum(CommunityType)
  type: CommunityType;
}
