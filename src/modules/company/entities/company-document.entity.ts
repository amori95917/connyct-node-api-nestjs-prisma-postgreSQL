import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';

@ObjectType()
export class CompanyDocument extends BaseEntity {
  @Field({ nullable: true })
  companyId: string;

  @Field({ nullable: true })
  type: string;

  @Field({ nullable: true })
  document: string;
}
