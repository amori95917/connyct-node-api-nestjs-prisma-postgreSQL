import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { ArgsType, Field, InputType } from '@nestjs/graphql';

import { BranchType } from '@prisma/client';

@InputType()
@ArgsType()
export class CompanyBranchEditInput {
  @Field(() => BranchType, { nullable: true })
  @IsOptional()
  type: BranchType;

  @Field(() => String, { nullable: true })
  @IsOptional()
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  contactEmail: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsPhoneNumber()
  contactNumber: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
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
