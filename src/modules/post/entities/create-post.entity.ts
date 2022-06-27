import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreatePost {
  @Field(() => ID)
  id: string;

  @Field()
  text: string;

  @Field()
  rating: number;

  @Field()
  creatorId: string;

  @Field()
  productId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
