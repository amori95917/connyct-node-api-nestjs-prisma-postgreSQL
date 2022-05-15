import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class CreateGeneralCompanyInput {
  @Field()
  name: string;

  @Field()
  legalName: string;

  @Field()
  registrationNumber: string;

  @Field()
  establishedDate: Date;

  @Field()
  businessType: string;

  @Field()
  ownership: string; // probably better to use enum

  @Field()
  companyStage: string;
}

@InputType()
export class CreateAddressCompanyInput {
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
