import { Field, ObjectType } from '@nestjs/graphql';
import { CustomError } from 'src/common/graphql/types/custom-error';
import { Reaction } from './reaction.entity';

@ObjectType()
export class ReactionPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => Reaction, { nullable: true })
  data?: Reaction;

  @Field({ nullable: true })
  isDisliked?: boolean;
}
