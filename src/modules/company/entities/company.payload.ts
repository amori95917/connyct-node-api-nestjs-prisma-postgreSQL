import { Field, ObjectType } from '@nestjs/graphql';
import { CustomError } from 'src/common/graphql/types/custom-error';
import { Company } from './company.entity';

@ObjectType()
export class CompanyPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => Company, { nullable: true })
  company?: Company;
}
