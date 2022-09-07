import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../prisma/entities/base.entity';
import { Paginated } from '../prisma/resolvers/pagination/pagination';
import { User } from '../user/entities/user.entity';
import { Comment } from '../comment/comment.models';
import { RepliesToReplies } from './replies-to-replies.model';

@ObjectType()
export class Replies extends BaseEntity {
  @Field(() => String, { nullable: true })
  text: string;

  @Field(() => String, { nullable: true })
  postId: string;

  @Field(() => String, { nullable: true })
  creatorId: string;

  @Field(() => String, { nullable: true })
  repliedToCommentId: string;

  @Field(() => Comment, { nullable: true })
  repliedTo: Comment;

  @Field(() => RepliesToReplies, { nullable: true })
  replies: RepliesToReplies;

  @Field(() => User, { nullable: true })
  creator?: User;
}

@ObjectType()
export class RepliesPagination extends Paginated(Replies) {}
