import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CustomError {
  @Field(() => String)
  public message!: string;

  @Field(() => String, { nullable: true })
  public code?: string;

  @Field(() => Number, { nullable: true })
  public statusCode?: number;
}
