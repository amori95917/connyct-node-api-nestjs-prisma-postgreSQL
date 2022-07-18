import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateCompanyInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  legalName: string;

  @Field()
  @IsNotEmpty()
  registrationNumber: string;

  @Field()
  @IsNotEmpty()
  establishedDate: Date;

  @Field()
  @IsNotEmpty()
  businessType: string;

  @Field()
  @IsNotEmpty()
  ownership: string; // probably better to use enum

  @Field()
  @IsNotEmpty()
  companyStage: string;

  @Field()
  branches: number;

  @Field()
  numberOfemployees: number;

  @Field()
  transactions: number;
}

@InputType()
export class CreateCompanyGeneralInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  legalName: string;

  @Field()
  @IsNotEmpty()
  registrationNumber: string;

  @Field()
  @IsNotEmpty()
  establishedDate: Date;

  @Field()
  @IsNotEmpty()
  businessType: string;

  @Field()
  @IsNotEmpty()
  ownership: string; // probably better to use enum

  @Field()
  @IsNotEmpty()
  companyStage: string;
}

@InputType()
export class AddressInput {
  @Field()
  @IsUUID('4')
  id: string;

  @Field()
  country: string;

  @Field()
  city: string;

  @Field({ nullable: true })
  state?: string;

  @Field()
  zipCode: string;

  @Field()
  address1: string;

  @Field()
  address2: string;
}

@InputType()
export class CreateCompanyAddressInput {
  @Field()
  @IsUUID('4')
  id: string;

  @Field()
  country: string;

  @Field()
  city: string;

  @Field({ nullable: true })
  state?: string;

  @Field()
  zipCode: string;

  @Field()
  address1: string;

  @Field()
  address2: string;
}

export type CompanyDataInput = {
  id?: string;
  name: string;
  legalName: string;
  registrationNumber: string;
  establishedDate: Date;
  businessType: string;
  ownership: string;
  companyStage: string;
  country: string;
  city: string;
  state?: string;
  zipCode: string;
  address1: string;
  address2: string;
};
