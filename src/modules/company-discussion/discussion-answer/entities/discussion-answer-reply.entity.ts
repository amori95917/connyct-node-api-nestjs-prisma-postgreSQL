import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';
import relayTypes from 'src/modules/prisma/resolvers/pagination/relay.types';
import { User } from 'src/modules/user/entities/user.entity';
import { CompanyDiscussion } from '../../discussion/entities/company-discussion.entity';
import { DiscussionAnswer } from './discussion-answer.entity';

@ObjectType()
export class DiscussionAnswerReply extends BaseEntity {
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

  @Field({ nullable: true })
  repliedToAnswerId: string;

  @Field(() => DiscussionAnswer, { nullable: true })
  parentAnswer?: DiscussionAnswer;

  @Field({ nullable: true })
  upVote?: number;
}
@ObjectType()
export class DiscussionAnswerReplyPaginated extends relayTypes<DiscussionAnswerReply>(
  DiscussionAnswerReply,
) {}
