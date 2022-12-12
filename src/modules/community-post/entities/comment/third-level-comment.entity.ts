import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';
import relayTypes from 'src/modules/prisma/resolvers/pagination/relay.types';
import { User } from 'src/modules/user/entities/user.entity';
import { SecondLevelComment } from './second-level-comment.entity';

@ObjectType()
export class ThirdLevelComment extends BaseEntity {
  @Field({ nullable: true })
  content: string;

  @Field({ nullable: true })
  authorId: string;

  @Field({ nullable: true })
  commentId: string;

  @Field(() => User, { nullable: true })
  creator?: User;

  @Field(() => SecondLevelComment, { nullable: true })
  secondLevelComment?: SecondLevelComment;
}
@ObjectType()
export class ThirdLevelCommentPagination extends relayTypes<ThirdLevelComment>(
  ThirdLevelComment,
) {}
