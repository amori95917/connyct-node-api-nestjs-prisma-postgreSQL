import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreatedBy {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  fullName: string;

  @Field({ nullable: true })
  image: string;
}
