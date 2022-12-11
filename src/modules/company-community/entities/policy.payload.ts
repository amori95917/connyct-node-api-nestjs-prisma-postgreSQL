import { Field, ObjectType } from '@nestjs/graphql';
import { CustomError } from 'src/common/graphql/types/custom-error';
import { CommunityPolicy, CommunityPolicyPaginated } from './policy.entity';

@ObjectType()
export class CommunityPoliciesPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => CommunityPolicyPaginated, { nullable: true })
  data?: CommunityPolicyPaginated;
}

@ObjectType()
export class CommunityPolicyPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => CommunityPolicy, { nullable: true })
  data?: CommunityPolicy;
}

@ObjectType()
export class CompanyPolicyDeletePayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => Boolean, { nullable: true })
  isDeleted?: boolean;
}
