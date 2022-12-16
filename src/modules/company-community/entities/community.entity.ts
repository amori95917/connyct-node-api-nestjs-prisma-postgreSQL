import { Field, ObjectType } from '@nestjs/graphql';
import { Company } from 'src/modules/company/entities/company.entity';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';
import relayTypes from 'src/modules/prisma/resolvers/pagination/relay.types';
import { User } from 'src/modules/user/entities/user.entity';
import { CommunityMemberPaginated } from './community-member.entity';
import { CommunityRole } from './community-role.entity';

@ObjectType()
export class Community extends BaseEntity {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  type: string;

  @Field({ nullable: true })
  profile: string;

  @Field({ nullable: true })
  coverImage: string;

  @Field({ nullable: true })
  companyId: string;

  @Field({ nullable: true })
  creatorId: string;

  @Field({ nullable: true })
  slug: string;

  @Field(() => Company, { nullable: true })
  company?: Company;

  @Field(() => User, { nullable: true })
  createdBy?: User;

  @Field(() => CommunityMemberPaginated, { nullable: true })
  members?: CommunityMemberPaginated;

  @Field(() => Number, { nullable: true })
  followersCount?: number;

  @Field(() => [CommunityRole], { nullable: true })
  communityRole?: CommunityRole[];
}

@ObjectType()
export class CommunityPaginated extends relayTypes<Community>(Community) {}
