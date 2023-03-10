import { Field, ObjectType } from '@nestjs/graphql';
import { CustomError } from 'src/common/graphql/types/custom-error';
import {
  CommunityMember,
  CommunityMemberPaginated,
} from './community-member.entity';

@ObjectType()
export class CommunityMemberPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => [CommunityMember], { nullable: true })
  communityMember?: CommunityMember[];
}
@ObjectType()
export class GetCommunityMemberPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => CommunityMemberPaginated, { nullable: true })
  communityMember?: CommunityMemberPaginated;
}
@ObjectType()
export class JoinCommunityPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => CommunityMember, { nullable: true })
  joinCommunity?: CommunityMember;
}
@ObjectType()
export class AcceptInvitePayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => Boolean, { nullable: true })
  isAccepted?: boolean;
}
