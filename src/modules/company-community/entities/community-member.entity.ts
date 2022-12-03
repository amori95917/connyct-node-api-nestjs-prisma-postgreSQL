import { Field, ObjectType } from '@nestjs/graphql';
import { Company } from 'src/modules/company/entities/company.entity';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Community } from './community.entity';

@ObjectType()
export class CommunityMember extends BaseEntity {
  @Field({ nullable: true })
  communityId: string;

  @Field({ nullable: true })
  invitedById: string;

  @Field({ nullable: true })
  memberId: string;

  @Field(() => Community, { nullable: true })
  community?: Community;

  @Field(() => [User], { nullable: true })
  users?: User[];

  @Field(() => Company, { nullable: true })
  company?: Company;
}
