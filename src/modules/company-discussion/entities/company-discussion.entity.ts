import { Field, ObjectType } from '@nestjs/graphql';
import { Company } from 'src/modules/company/entities/company.entity';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';
import relayTypes from 'src/modules/prisma/resolvers/pagination/relay.types';
import { DiscussionAnswer } from './discussion-answer.entity';

@ObjectType()
export class CompanyDiscussion extends BaseEntity {
  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  companyId: string;

  @Field(() => Company, { nullable: true })
  company?: Company;

  @Field(() => [DiscussionAnswer], { nullable: true })
  discussionAnswer?: DiscussionAnswer[];
}

@ObjectType()
export class DiscussionPaginated extends relayTypes<CompanyDiscussion>(
  CompanyDiscussion,
) {}
