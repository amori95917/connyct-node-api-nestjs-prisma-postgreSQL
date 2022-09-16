import { Field, ObjectType } from '@nestjs/graphql';
import { CustomError } from 'src/common/graphql/types/custom-error';
import {
  CommentReactions,
  CommentReactionsPagination,
} from '../comment-reactions.model';

@ObjectType()
export class CommentReactionsPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => CommentReactions, { nullable: true })
  commentReactions?: CommentReactions;

  @Field({ nullable: true })
  isDisliked?: boolean;
}

@ObjectType()
export class CommentReactionPaginationPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => CommentReactionsPagination, { nullable: true })
  reactions?: CommentReactionsPagination;
}
