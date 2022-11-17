import { Field, ObjectType } from '@nestjs/graphql';
import { CustomError } from 'src/common/graphql/types/custom-error';
import { CompanyDiscussion } from './company-discussion.entity';

@ObjectType()
export class CompanyDiscussionPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => CompanyDiscussion, { nullable: true })
  companyDiscussion?: CompanyDiscussion;
}

@ObjectType()
export class CompanyDiscussionDeletePayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => Boolean, { nullable: true })
  isDeleted?: boolean;
}
