import { Field, ObjectType } from '@nestjs/graphql';
import { Likes } from '../likes.model';

@ObjectType()
export class LikesPayload {
  @Field(() => Likes, { nullable: true })
  likes?: Likes;

  @Field({ nullable: true })
  isDisliked?: boolean;
}
