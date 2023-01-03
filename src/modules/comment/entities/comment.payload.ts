import { Field, ObjectType } from '@nestjs/graphql';
import { CustomError } from 'src/common/graphql/types/custom-error';
import {
  PostFirstLevelComment,
  PostFirstLevelCommentPagination,
} from './first-level-comment.entity';
import {
  PostSecondLevelComment,
  PostSecondLevelCommentPagination,
} from './second-level-comment.entity';

@ObjectType()
export class GetPostFirstLevelCommentPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => PostFirstLevelCommentPagination, { nullable: true })
  public data?: PostFirstLevelCommentPagination;
}
@ObjectType()
export class GetPostSecondLevelCommentPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => PostSecondLevelCommentPagination, { nullable: true })
  public data?: PostSecondLevelCommentPagination;
}

@ObjectType()
export class PostFirstLevelCommentPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => PostFirstLevelComment, { nullable: true })
  public data?: PostFirstLevelComment;
}
@ObjectType()
export class PostSecondLevelCommentPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => PostSecondLevelComment, { nullable: true })
  public data?: PostSecondLevelComment;
}

@ObjectType()
export class PostDeleteCommentPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => Boolean, { nullable: true })
  public isDeleted?: boolean;
}
