import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';
import relayTypes from 'src/modules/prisma/resolvers/pagination/relay.types';
import { User } from 'src/modules/user/entities/user.entity';
import { CompanyDiscussion } from '../../discussion/entities/company-discussion.entity';

@ObjectType()
export class DiscussionAnswer extends BaseEntity {
  @Field({ nullable: true })
  answer: string;

  @Field({ nullable: true })
  discussionId: string;

  @Field(() => CompanyDiscussion, { nullable: true })
  discussion?: CompanyDiscussion;

  @Field({ nullable: true })
  userId: string;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [DiscussionAnswer], { nullable: true })
  reply?: DiscussionAnswer[];
}
@ObjectType()
export class DiscussionAnswerPaginated extends relayTypes<DiscussionAnswer>(
  DiscussionAnswer,
) {}
