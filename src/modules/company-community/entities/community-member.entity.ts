import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';
import relayTypes from 'src/modules/prisma/resolvers/pagination/relay.types';
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
}

@ObjectType()
export class CommunityMemberPaginated extends relayTypes<CommunityMember>(
  CommunityMember,
) {}
