import { Field, ObjectType } from '@nestjs/graphql';

import { Paginated } from 'src/modules/prisma/resolvers/pagination/pagination';

import { BaseEntity } from '../../prisma/entities/base.entity';

@ObjectType()
export class GeneralCompany extends BaseEntity {
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
  ownership: string;

  @Field()
  companyStage: string;
}

@ObjectType()
export class Company extends BaseEntity {
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
  ownership: string;

  @Field()
  companyStage: string;

  @Field()
  country: string;

  @Field()
  city: string;

  @Field()
  state?: string;

  @Field()
  zipCode: string;

  @Field()
  address1: string;

  @Field()
  address2: string;
}

@ObjectType()
export class CompanyPaginated extends Paginated(Company) {}
