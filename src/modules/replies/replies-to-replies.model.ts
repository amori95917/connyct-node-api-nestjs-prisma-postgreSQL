import { Field, ObjectType } from '@nestjs/graphql';
import { Comment } from '../comment/comment.models';
import { BaseEntity } from '../prisma/entities/base.entity';
import { Paginated } from '../prisma/resolvers/pagination/pagination';
import { User } from '../user/entities/user.entity';

@ObjectType()
export class RepliesToReplies extends BaseEntity {
  @Field(() => String, { nullable: true })
  text: string;

  @Field(() => String, { nullable: true })
  creatorId: string;

  @Field(() => String, { nullable: true })
  repliedToCommentId?: string;

  @Field(() => String, { nullable: true })
  repliedToReplyId?: string;

  @Field(() => Comment, { nullable: true })
  repliedToComment?: Comment;

  @Field(() => Comment, { nullable: true })
  repliedToReplies?: Comment;

  @Field(() => User, { nullable: true })
  creator?: User;
}
@ObjectType()
export class RepliesToRepliesPagination extends Paginated(RepliesToReplies) {}
