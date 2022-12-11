import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';
import relayTypes from 'src/modules/prisma/resolvers/pagination/relay.types';

@ObjectType()
export class CommunityPolicy extends BaseEntity {
  @Field({ nullable: true })
  communityId: string;

  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  description: string;
}

@ObjectType()
export class CommunityPolicyPaginated extends relayTypes<CommunityPolicy>(
  CommunityPolicy,
) {}
