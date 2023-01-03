import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

import { Company } from '../company/entities/company.entity';
import relayTypes from '../prisma/resolvers/pagination/relay.types';
import { RatingStatus } from '../rating/entities/rating-status.enum';
import { User } from '../user/entities/user.entity';
import { PostImage } from './entities/post-image.entity';
import { Tag } from './entities/tags.entity';
import { PostFirstLevelComment } from '../comment/entities/first-level-comment.entity';
import { BaseEntity } from '../prisma/entities/base.entity';

registerEnumType(RatingStatus, {
  name: 'RatingStatus',
});

@ObjectType()
export class Post extends BaseEntity {
  @Field(() => String, { nullable: true })
  public text!: string;

  @Field(() => Int, { nullable: true })
  public rating!: number;

  @Field(() => RatingStatus, { defaultValue: RatingStatus.NEUTRAL })
  public myRatingStatus?: RatingStatus;

  @Field(() => String, { nullable: true })
  public creatorId!: string;

  @Field(() => [PostFirstLevelComment], { nullable: true })
  public comments?: PostFirstLevelComment[];

  @Field(() => Boolean, { nullable: true })
  isSaleAble: boolean;

  @Field(() => String, { nullable: true })
  companyId: string;

  @Field(() => [PostImage], { nullable: true })
  postImage?: PostImage[];

  @Field(() => [Tag], { nullable: true })
  tags?: Tag[];

  @Field(() => Company, { nullable: true })
  company?: Company;

  @Field(() => User, { nullable: true })
  creator?: User;

  @Field({ nullable: true })
  reactionCount?: number;

  @Field({ nullable: true })
  commentCount?: number;
}

@ObjectType()
export class PostPagination extends relayTypes<Post>(Post) {}
