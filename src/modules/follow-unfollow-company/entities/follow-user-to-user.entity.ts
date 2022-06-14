import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FollowUserToUser {
  @Field(() => ID)
  id: string;

  @Field()
  followedToId: string;

  @Field()
  followedById: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
