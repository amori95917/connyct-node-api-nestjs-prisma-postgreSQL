import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { CompanyDiscussion } from './company-discussion.entity';

@ObjectType()
export class DiscussionVote extends BaseEntity {
  @Field({ nullable: true })
  vote: string;

  @Field({ nullable: true })
  userId: string;

  @Field(() => [User], { nullable: true })
  user?: User[];

  @Field({ nullable: true })
  discussionId: string;

  @Field(() => CompanyDiscussion, { nullable: true })
  discussion?: CompanyDiscussion;
}
