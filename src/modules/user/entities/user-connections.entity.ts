import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class UserConnectionsSummary {
  @Field({ nullable: true })
  connectedBrands: number;

  @Field({ nullable: true, description: 'Evangelists I have followed' })
  connectedEvangelists: number;

  @Field({ nullable: true, description: 'Evangelists that follow me' })
  evangelers: number;

  @Field({ nullable: true })
  connectedCommunities: number;
}

@ObjectType()
export class UserConnectionsSummaryEntity {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  username: string;

  @Field({ nullable: true })
  fullName: string;

  @Field({ nullable: true })
  isValid: boolean;

  @Field({ nullable: true })
  summary: UserConnectionsSummary;
}

// await db.user.findMany({ where: { email: 'programmertushant+test@gmail.com' }, include: { _count: { select: { FollowUnfollowCompany: true, FollowedToUser: true, FollowedByUser: true, CompanyCommunity: true  } } } })
