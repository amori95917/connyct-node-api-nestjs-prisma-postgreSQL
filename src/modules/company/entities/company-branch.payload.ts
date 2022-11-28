import { Branch } from './branch.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { CustomError } from 'src/common/graphql/types/custom-error';

@ObjectType()
export class CompanyBranchPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => Branch, { nullable: true })
  branch?: Branch;
}

@ObjectType()
export class GetCompanyBranchPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => [Branch], { nullable: true })
  branches?: Branch[];
}
@ObjectType()
export class CompanyBranchDeletePayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => Boolean, { nullable: true })
  isDeleted?: boolean;
}
