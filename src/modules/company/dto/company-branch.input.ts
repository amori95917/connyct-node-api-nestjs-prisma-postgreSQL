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
  @IsNotEmpty()
  type: BranchType;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  contactEmail: string;

  @Field()
  @IsNotEmpty()
  @IsPhoneNumber('NP')
  contactNumber: string;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsString()
  country: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsNotEmpty()
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
  street: string;
}
