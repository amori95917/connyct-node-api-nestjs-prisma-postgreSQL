import { Float } from 'type-graphql';
import { Field, ObjectType } from '@nestjs/graphql';

import { Paginated } from 'src/modules/prisma/resolvers/pagination/pagination';

import { BaseEntity } from '../../prisma/entities/base.entity';

import JSON from 'graphql-type-json';
// @ObjectType()
// export class CompanyAddress {
//   @Field()
//   country: string;

//   @Field()
//   city: string;

//   @Field()
//   zipCode: string;

//   @Field()
//   state: string;

//   @Field()
//   street: string;
// }

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
  companyStage: string;

  @Field()
  description: string;

  @Field()
  ownership: string;

  @Field()
  mission: string;

  @Field()
  vision: string;

  @Field(() => JSON)
  addresses: any;

  @Field()
  numberOfemployees: number;

  @Field()
  contactEmail: string;

  @Field(() => Float)
  transactions: number;

  @Field()
  isActive: boolean;

  @Field()
  isVerified: boolean;

  @Field()
  ownerId: string;
}

@ObjectType()
export class CompanyPaginated extends Paginated(Company) {}
