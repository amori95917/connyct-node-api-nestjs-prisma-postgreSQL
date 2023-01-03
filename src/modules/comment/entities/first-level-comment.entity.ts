import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';
import relayTypes from 'src/modules/prisma/resolvers/pagination/relay.types';
import { User } from 'src/modules/user/entities/user.entity';
import { Company } from 'src/modules/company/entities/company.entity';
import { Post } from 'src/modules/post/post.models';
import { PostSecondLevelCommentPagination } from './second-level-comment.entity';

@ObjectType()
export class PostFirstLevelComment extends BaseEntity {
  @Field({ nullable: true })
  content: string;

  @Field({ nullable: true })
  postId: string;

  @Field({ nullable: true })
  authorId: string;

  @Field(() => PostSecondLevelCommentPagination, { nullable: true })
  secondLevelComment?: PostSecondLevelCommentPagination;

  @Field(() => User, { nullable: true })
  creator?: User;

  @Field(() => Post, { nullable: true })
  post?: Post;

  @Field(() => Company, { nullable: true })
  company?: Company;

  @Field(() => Number, { nullable: true })
  repliesCount?: number;
}
@ObjectType()
export class PostFirstLevelCommentPagination extends relayTypes<PostFirstLevelComment>(
  PostFirstLevelComment,
) {}
