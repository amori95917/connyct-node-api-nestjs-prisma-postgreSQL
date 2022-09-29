import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';

@ObjectType()
export class PostImage extends BaseEntity {
  @Field({ nullable: true })
  metaTitle: string;

  @Field({ nullable: true })
  imageURL: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  postId: string;
}
