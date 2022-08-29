import {
  IsDate,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { CompanyStage, Ownership } from '@prisma/client';
import { Float } from 'type-graphql';

@InputType()
export class CompanyAddress {
  @Field(() => String, { nullable: true })
  officeType: string;

  @Field(() => String, { nullable: true })
  branch: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
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
  street: string;
}

@InputType()
export class CompanyEditInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  legalName: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  name: string;

  @Field(() => String)
  @IsString()
  @Length(3, 35, {
    message: 'Registration number must be between 3 to 35 characters',
  })
  @IsString()
  registrationNumber: string;

  @Field(() => Date)
  @IsNotEmpty()
  @IsDate()
  establishedDate: Date;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  companyStage: CompanyStage;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  mission: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  vision: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  ownership: Ownership;

  @Field({ nullable: true })
  @IsOptional()
  @IsObject()
  addresses: CompanyAddress;

  @Field(() => String)
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  contactEmail: string;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsInt()
  numberOfemployees: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  transactions: number;
  // check this field type?

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  website: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  contactNumber: string;

  @Field(() => String, { nullable: true })
  slogan: string;
}
