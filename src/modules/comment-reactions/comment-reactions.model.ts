import { Field, ObjectType } from '@nestjs/graphql';
import { Comment } from '../comment/comment.models';
import { Post } from '../post/post.models';
import { BaseEntity } from '../prisma/entities/base.entity';
import { Paginated } from '../prisma/resolvers/pagination/pagination';
import { User } from '../user/entities/user.entity';

@ObjectType()
export class CommentReactions extends BaseEntity {
  @Field({ nullable: true })
  reactionId: string;

  @Field({ nullable: true })
  commentId: string;

  @Field({ nullable: true })
  creatorId: string;

  @Field(() => Comment, { nullable: true })
  comment?: Comment;

  @Field(() => [User], { nullable: true })
  reactors?: User[];
}

@ObjectType()
export class CommentReactionsPagination extends Paginated(CommentReactions) {}
