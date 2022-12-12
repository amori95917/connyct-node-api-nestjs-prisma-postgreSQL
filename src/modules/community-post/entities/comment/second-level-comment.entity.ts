import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';
import relayTypes from 'src/modules/prisma/resolvers/pagination/relay.types';
import { User } from 'src/modules/user/entities/user.entity';
import { FirstLevelComment } from './first-level-comment.entity';
import { ThirdLevelCommentPagination } from './third-level-comment.entity';

@ObjectType()
export class SecondLevelComment extends BaseEntity {
  @Field({ nullable: true })
  content: string;

  @Field({ nullable: true })
  authorId: string;

  @Field({ nullable: true })
  commentId: string;

  @Field(() => ThirdLevelCommentPagination, { nullable: true })
  thirdLevelComment?: ThirdLevelCommentPagination;

  @Field(() => User, { nullable: true })
  creator?: User;

  @Field(() => FirstLevelComment, { nullable: true })
  firstLevelComment?: FirstLevelComment;
}
@ObjectType()
export class SecondLevelCommentPagination extends relayTypes<SecondLevelComment>(
  SecondLevelComment,
) {}
