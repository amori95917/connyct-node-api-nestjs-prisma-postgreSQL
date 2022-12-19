import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export abstract class BaseEntity {
  @Field(() => ID, { nullable: true })
  public id: string;

  @Field({ nullable: true })
  public createdAt: Date;

  @Field({ nullable: true })
  public updatedAt: Date;
}
