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
  @IsOptional()
  @IsString()
  @Length(3, 35, { message: 'country name must be between 3 to 35 characters' })
  country: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(3, 35, { message: 'city name must be between 3 to 35 characters' })
  city: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(3, 35, { message: 'zipCode  must be between 3 to 35 characters' })
  zipCode: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(3, 35, { message: 'state must be between 3 to 35 characters' })
  state: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(3, 35, { message: 'street must be between 3 to 35 characters' })
  street: string;
}

@InputType()
export class CompanyEditInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(3, 35, { message: 'Name must be between 3 to 35 characters' })
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
  @MinLength(8, { message: 'Description must be atleast 8 characters' })
  description: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Mission must be atleast 8 characters' })
  mission: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Vision must be atleast 8 characters' })
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
}
