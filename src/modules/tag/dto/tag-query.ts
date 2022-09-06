import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TagQuery {
  @Field(() => String, { defaultValue: null, nullable: true })
  name?: string;
}
