import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

import { Post } from '../post/post.models';
import { RatingStatus } from '../rating/entities/rating-status.enum';
import { User } from '../user/entities/user.entity';

registerEnumType(RatingStatus, {
  name: 'RatingStatus',
});

@ObjectType()
export class Comment {
  @Field(() => ID)
  public id!: string;

  @Field(() => String)
  public text!: string;

  @Field(() => User)
  public creator?: User;

  @Field(() => Int)
  public rating!: number;

  @Field(() => RatingStatus, { defaultValue: RatingStatus.NEUTRAL })
  public myRatingStatus?: RatingStatus;

  @Field()
  public createdAt!: Date;

  @Field(() => Post, { nullable: true })
  public post?: Post | null;

  @Field(() => Int, { nullable: true })
  public postId!: string | null;

  @Field(() => Comment, { nullable: true })
  public repliedTo?: Comment | null;

  @Field(() => Int, { nullable: true })
  public repliedToId!: string | null;

  @Field(() => [Comment])
  public replies?: Comment[];

  @Field(() => Int)
  public creatorId!: string;
}
