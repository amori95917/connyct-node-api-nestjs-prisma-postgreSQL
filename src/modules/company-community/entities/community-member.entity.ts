import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';
import relayTypes from 'src/modules/prisma/resolvers/pagination/relay.types';
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

  @Field({ nullable: true })
  isConnected: boolean;

  @Field(() => Community, { nullable: true })
  community?: Community;

  @Field(() => User, { nullable: true })
  member?: User;
}

@ObjectType()
export class CommunityMemberPaginated extends relayTypes<CommunityMember>(
  CommunityMember,
) {}
