import { Field, ObjectType } from '@nestjs/graphql';
import { CustomError } from 'src/common/graphql/types/custom-error';
import {
  CommunityPostCommentReaction,
  CommunityPostCommentReactionsPagination,
} from './comment-reaction.entity';

@ObjectType()
export class CommunityPostCommentReactionPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => CommunityPostCommentReaction, { nullable: true })
  data?: CommunityPostCommentReaction;

  @Field({ nullable: true })
  isDisliked?: boolean;
}
@ObjectType()
export class CommunityPostCommentReactionPaginationPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => CommunityPostCommentReactionsPagination, { nullable: true })
  data?: CommunityPostCommentReactionsPagination;
}
