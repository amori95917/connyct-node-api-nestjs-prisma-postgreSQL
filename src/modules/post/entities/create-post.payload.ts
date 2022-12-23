import { Field, ObjectType } from '@nestjs/graphql';
import { CustomError } from 'src/common/graphql/types/custom-error';

import { Post } from '../post.models';
import { PostImage } from './post-image.entity';
import { Tag } from './tags.entity';

@ObjectType()
export class CreatePostPayload {
  @Field(() => [CustomError], { nullable: true })
  public errors?: CustomError[] | undefined;

  @Field(() => Post, { nullable: true })
  public post?: Post;

  @Field(() => [PostImage], { nullable: true })
  postImage?: PostImage[];

  @Field(() => [Tag], { nullable: true })
  tags?: Tag[];
}
