import {
  IsDate,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { CompanyStage, Ownership } from '@prisma/client';
import { Float } from 'type-graphql';

@InputType()
export class CompanyAddress {
  @Field({ nullable: true })
  @IsOptional()
  country: string;

  @Field({ nullable: true })
  @IsOptional()
  city: string;

  @Field({ nullable: true })
  @IsOptional()
  zipCode: string;

  @Field({ nullable: true })
  @IsOptional()
  state: string;

  @Field({ nullable: true })
  @IsOptional()
  street: string;
}

@InputType()
export class CompanyEditInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Min(3)
  name: string;

  @Field()
  @IsString()
  @MinLength(6, {
    message: 'Registration number should be at least of 6 char length',
  })
  @IsString()
  registrationNumber: string;

  @Field()
  @IsNotEmpty()
  @IsDate()
  establishedDate: Date;

  @Field({ nullable: true })
  @IsOptional()
  companyStage: CompanyStage;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  mission: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  vision: string;

  @Field({ nullable: true })
  @IsOptional()
  ownership: Ownership;

  @Field({ nullable: true })
  @IsOptional()
  @IsObject()
  addresses: CompanyAddress;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  contactEmail: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  numberOfemployees: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsInt()
  transactions: number;
}
