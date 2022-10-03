import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

import { Comment } from '../comment/comment.models';
import relayTypes from '../prisma/resolvers/pagination/relay.types';
import { RatingStatus } from '../rating/entities/rating-status.enum';
import { User } from '../user/entities/user.entity';
import { PostImage } from './entities/post-image.entity';
import { Tag } from './entities/tags.entity';

registerEnumType(RatingStatus, {
  name: 'RatingStatus',
});

@ObjectType()
export class Post {
  @Field(() => ID)
  public id!: string;

  @Field(() => String)
  public text!: string;

  @Field(() => User)
  public creator?: User;

  @Field(() => Int)
  public rating!: number;

  @Field(() => Date)
  public createdAt!: Date;

  @Field(() => RatingStatus, { defaultValue: RatingStatus.NEUTRAL })
  public myRatingStatus?: RatingStatus;

  @Field(() => String)
  public creatorId!: string;

  @Field(() => [Comment])
  public comments?: Comment[];

  @Field(() => Boolean, { nullable: true })
  isSaleAble: boolean;

  @Field(() => String, { nullable: true })
  companyId: string;

  @Field(() => [PostImage])
  postImage?: PostImage[];

  @Field(() => [Tag])
  tags?: Tag[];
}

@ObjectType()
export class PostPagination extends relayTypes<Post>(Post) {}
