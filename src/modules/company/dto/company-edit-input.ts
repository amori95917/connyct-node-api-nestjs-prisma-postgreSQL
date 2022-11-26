import {
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { CompanyStage } from '@prisma/client';
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

enum RegistrationNumberType {
  PAN = 'PAN',
  VAT = 'VAT',
}
@InputType()
export class CompanyEditInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  legalName: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description: string;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsString()
  @IsEnum(RegistrationNumberType)
  registrationNumberType: RegistrationNumberType;

  @Field(() => String)
  @IsNotEmpty()
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
  slogan: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  companyStage: CompanyStage;
}
