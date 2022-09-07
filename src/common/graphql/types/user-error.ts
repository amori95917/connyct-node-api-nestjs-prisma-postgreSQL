import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserError {
  @Field(() => String)
  public message!: string;

  @Field(() => String, { nullable: true })
  public field?: string;

  @Field(() => String, { nullable: true })
  public code?: string;

  @Field(() => Number, { nullable: true })
  public status?: number;
}
