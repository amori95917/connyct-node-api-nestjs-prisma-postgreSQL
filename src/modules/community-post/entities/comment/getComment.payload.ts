import { Field, ObjectType } from '@nestjs/graphql';
import { CustomError } from 'src/graphql';
import { FirstLevelCommentPagination } from './first-level-comment.entity';
import { SecondLevelCommentPagination } from './second-level-comment.entity';
import { ThirdLevelCommentPagination } from './third-level-comment.entity';

@ObjectType()
export class GetFirstLevelCommentPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => FirstLevelCommentPagination, { nullable: true })
  public comment?: FirstLevelCommentPagination;
}
@ObjectType()
export class GetSecondLevelCommentPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => SecondLevelCommentPagination, { nullable: true })
  public comment?: SecondLevelCommentPagination;
}
@ObjectType()
export class GetThirdLevelCommentPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => ThirdLevelCommentPagination, { nullable: true })
  public comment?: ThirdLevelCommentPagination;
}
