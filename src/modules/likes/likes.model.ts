import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';

@ObjectType()
export class Likes extends BaseEntity {
  @Field()
  postId: string;

  @Field()
  reactionId: string;

  @Field()
  userId: string;
}
