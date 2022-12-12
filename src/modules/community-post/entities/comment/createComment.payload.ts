import { Field, ObjectType } from '@nestjs/graphql';
import { CustomError } from 'src/common/graphql/types/custom-error';
import { FirstLevelComment } from './first-level-comment.entity';
import { SecondLevelComment } from './second-level-comment.entity';
import { ThirdLevelComment } from './third-level-comment.entity';

@ObjectType()
export class FirstLevelCommentPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => FirstLevelComment, { nullable: true })
  public comment?: FirstLevelComment;
}
@ObjectType()
export class SecondLevelCommentPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => SecondLevelComment, { nullable: true })
  public comment?: SecondLevelComment;
}
@ObjectType()
export class ThirdLevelCommentPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => ThirdLevelComment, { nullable: true })
  public comment?: ThirdLevelComment;
}
