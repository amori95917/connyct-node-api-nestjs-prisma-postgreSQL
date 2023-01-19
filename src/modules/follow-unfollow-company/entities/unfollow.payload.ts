import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UnfollowPayload {
  @Field()
  isUnfollow: boolean;
}
