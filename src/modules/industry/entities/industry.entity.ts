import { Field, ObjectType } from '@nestjs/graphql';
import { Industry } from '../industry.models';

@ObjectType()
export class IndustryPayload {
  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => [Industry], { nullable: true })
  industries?: Industry[];

  @Field(() => Industry, { nullable: true })
  industry?: Industry;

  @Field({ nullable: true })
  isDeletedSuccessful?: boolean;
}
