import { Paginated } from 'src/modules/prisma/resolvers/pagination/pagination';
import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

import { Post } from '../post/post.models';
import { RatingStatus } from '../rating/entities/rating-status.enum';
import { User } from '../user/entities/user.entity';
import { BaseEntity } from '../prisma/entities/base.entity';
import { RepliesPagination } from '../replies/replies.models';

registerEnumType(RatingStatus, {
  name: 'RatingStatus',
});

@ObjectType()
export class Comment extends BaseEntity {
  @Field(() => String)
  public text!: string;

  @Field(() => String)
  public creatorId!: string;

  @Field(() => String, { nullable: true })
  public postId!: string | null;

  @Field(() => String, { nullable: true })
  public repliedToCommentId!: string | null;

  @Field(() => String, { nullable: true })
  public repliedToReplyId!: string | null;

  @Field(() => Int, { nullable: true })
  public rating!: number;

  @Field(() => RepliesPagination, { nullable: true })
  public replies?: RepliesPagination;

  @Field(() => RatingStatus, { defaultValue: RatingStatus.NEUTRAL })
  public myRatingStatus?: RatingStatus;

  @Field(() => User)
  public creator?: User;

  @Field(() => [User], { nullable: true })
  mentions?: User[];

  @Field(() => Post, { nullable: true })
  public post?: Post | null;
}
@ObjectType()
export class CommentPagination extends Paginated(Comment) {}
