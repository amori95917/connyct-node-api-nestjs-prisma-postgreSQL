import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { CompanyDiscussion } from './company-discussion.entity';
import { DiscussionAnswer } from './discussion-answer.entity';

@ObjectType()
export class DiscussionAnswerVote extends BaseEntity {
  @Field({ nullable: true })
  vote: string;

  @Field({ nullable: true })
  discussionId: string;

  @Field(() => CompanyDiscussion, { nullable: true })
  discussion?: CompanyDiscussion;

  @Field({ nullable: true })
  userId: string;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => DiscussionAnswer, { nullable: true })
  discussionAnswer?: DiscussionAnswer;
}
