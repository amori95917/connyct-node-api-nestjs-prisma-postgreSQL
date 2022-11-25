import { Field, ObjectType } from '@nestjs/graphql';
import { RepliesToReplies } from 'src/modules/replies/replies-to-replies.model';
import { Replies } from 'src/modules/replies/replies.models';

import { MutationPayload } from '../../../common/graphql/interfaces/mutation-payload';
import { UserError } from '../../../common/graphql/types/user-error';
import { Comment } from '../comment.models';

@ObjectType({ implements: () => [MutationPayload] })
export class NewReplyPayload implements MutationPayload {
  @Field(() => [UserError], { nullable: true })
  public errors?: UserError[] | undefined;

  @Field(() => Comment, { nullable: true })
  public comment?: Comment;
}
@ObjectType()
export class CommentDeletePayload implements MutationPayload {
  @Field(() => [UserError], { nullable: true })
  public errors?: UserError[] | undefined;

  @Field(() => Boolean, { nullable: true })
  public isDeleted?: boolean;
}
