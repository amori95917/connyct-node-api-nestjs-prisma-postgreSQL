import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ArgsType, Field, InputType } from '@nestjs/graphql';

import { BranchType } from '@prisma/client';

@InputType()
@ArgsType()
export class CompanyBranchInput {
  @Field(() => BranchType)
  type: BranchType;

  @Field(() => String, { nullable: true })
  @IsOptional()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  contactEmail: string;

  @Field()
  @IsNotEmpty()
  @IsPhoneNumber()
  contactNumber: string;

  @Field(() => String, { nullable: true })
  @IsString()
  country: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  city: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  zipCode: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  state: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  street1: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  street2: string;
}
