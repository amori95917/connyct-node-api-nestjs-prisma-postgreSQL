import { Field, ObjectType } from '@nestjs/graphql';
import { CustomError } from 'src/common/graphql/types/custom-error';

@ObjectType()
export class DeletePostPayload {
  @Field(() => [CustomError], { nullable: true })
  public errors?: CustomError[] | undefined;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  public isDeleteSuccessful?: boolean;
}
