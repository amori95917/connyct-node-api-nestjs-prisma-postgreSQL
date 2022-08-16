import { Paginated } from 'src/modules/prisma/resolvers/pagination/pagination';
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

  @Field(() => String, { nullable: true })
  public postId!: string | null;

  @Field(() => Comment, { nullable: true })
  public repliedTo?: Comment | null;

  @Field(() => String, { nullable: true })
  public repliedToId!: string | null;

  @Field(() => [Comment])
  public replies?: Comment[];

  @Field(() => String)
  public creatorId!: string;
}
@ObjectType()
export class CommentPagination extends Paginated(Comment) {}
