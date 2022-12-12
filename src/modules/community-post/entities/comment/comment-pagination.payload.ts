import { Field, ObjectType } from '@nestjs/graphql';
import { CustomError } from 'src/common/graphql/types/custom-error';
import { FirstLevelCommentPagination } from './first-level-comment.entity';
import { SecondLevelCommentPagination } from './second-level-comment.entity';
import { ThirdLevelCommentPagination } from './third-level-comment.entity';

@ObjectType()
export class FirstLevelCommentPaginatedPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => FirstLevelCommentPagination, { nullable: true })
  public comment?: FirstLevelCommentPagination;
}
@ObjectType()
export class SecondLevelCommentPaginatedPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => SecondLevelCommentPagination, { nullable: true })
  public comment?: SecondLevelCommentPagination;
}
@ObjectType()
export class ThirdLevelCommentPaginatedPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => ThirdLevelCommentPagination, { nullable: true })
  public comment?: ThirdLevelCommentPagination;
}
