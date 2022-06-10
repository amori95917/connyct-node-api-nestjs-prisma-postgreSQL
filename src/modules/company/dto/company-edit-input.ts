import {
  IsDate,
  IsEmail,
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
import { Type } from 'class-transformer';

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
  @Min(3)
  name: string;

  @Field()
  @IsString()
  @MinLength(6, {
    message: 'Registration number should be at least of 6 char length',
  })
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
  description: string;

  @Field({ nullable: true })
  @IsOptional()
  mission: string;

  @Field({ nullable: true })
  @IsOptional()
  vision: string;

  @Field({ nullable: true })
  @IsOptional()
  ownership: Ownership;

  @Field({ nullable: true })
  @IsOptional()
  @IsObject()
  @Type(() => CompanyAddress)
  addresses: CompanyAddress;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  contactEmail: string;

  @Field({ nullable: true })
  @IsOptional()
  numberOfemployees: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  transactions: number;
}
