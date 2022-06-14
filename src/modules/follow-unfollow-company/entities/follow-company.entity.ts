import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FollowCompany {
  @Field(() => ID)
  id: string;

  @Field()
  followedById: string;

  @Field()
  followedToId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
