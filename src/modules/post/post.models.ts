import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

import { Comment } from '../comment/comment.models';
import { RatingStatus } from '../rating/entities/rating-status.enum';
import { User } from '../user/entities/user.entity';
import { Product } from './entities/product.entity';
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

  @Field(() => Boolean)
  isSaleAble: boolean;

  @Field(() => String)
  companyId: string;

  @Field(() => [Product])
  product?: Product[];

  @Field(() => [Tag])
  tags?: Tag[];
}
