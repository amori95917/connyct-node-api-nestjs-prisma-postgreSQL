import { Field, ObjectType } from '@nestjs/graphql';
import { Company } from 'src/modules/company/entities/company.entity';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';
import relayTypes from 'src/modules/prisma/resolvers/pagination/relay.types';
import { User } from 'src/modules/user/entities/user.entity';
import {
  DiscussionAnswer,
  DiscussionAnswerPaginated,
} from '../../discussion-answer/entities/discussion-answer.entity';
import { CreatedBy } from './createdBy.entity';
import { DiscussionVote } from './discussion-vote.entity';

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

  @Field({ nullable: true })
  userId: string;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => DiscussionAnswerPaginated, { nullable: true })
  discussionAnswer?: DiscussionAnswerPaginated;

  @Field(() => [DiscussionVote], { nullable: true })
  discussionVote?: DiscussionVote[];

  @Field({ nullable: true })
  upVote?: number;

  @Field(() => CreatedBy, { nullable: true })
  createdBy?: CreatedBy;
}

@ObjectType()
export class DiscussionPaginated extends relayTypes<CompanyDiscussion>(
  CompanyDiscussion,
) {}
