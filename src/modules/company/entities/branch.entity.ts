import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BranchType } from '@prisma/client';
import { BaseEntity } from '../../prisma/entities/base.entity';

registerEnumType(BranchType, {
  name: 'BranchType',
  description: 'The branch type can be CORPORATE and BRANCH_OFFICE',
});

@ObjectType()
export class Branch extends BaseEntity {
  @Field({ nullable: true })
  name?: string;
  @Field(() => BranchType)
  type: BranchType;
  @Field()
  contactEmail: string;
  @Field()
  contactNumber: string;
  @Field()
  country: string;
  @Field()
  city: string;
  @Field({ nullable: true })
  zipCode?: string;
  @Field({ nullable: true })
  state?: string;
  @Field({ nullable: true })
  street1: string;
  @Field({ nullable: true })
  street2: string;
}
