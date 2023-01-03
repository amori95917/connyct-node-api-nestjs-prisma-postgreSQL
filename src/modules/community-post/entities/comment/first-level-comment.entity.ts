import { Field, ObjectType } from '@nestjs/graphql';
import { Community } from 'src/modules/company-community/entities/community.entity';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';
import relayTypes from 'src/modules/prisma/resolvers/pagination/relay.types';
import { User } from 'src/modules/user/entities/user.entity';
import { CommunityPost } from '../post/community-post.entity';
import { SecondLevelCommentPagination } from './second-level-comment.entity';

@ObjectType()
export class FirstLevelComment extends BaseEntity {
  @Field({ nullable: true })
  content: string;

  @Field({ nullable: true })
  communityPostId: string;

  @Field({ nullable: true })
  authorId: string;

  @Field(() => SecondLevelCommentPagination, { nullable: true })
  secondLevelComment?: SecondLevelCommentPagination;

  @Field(() => User, { nullable: true })
  creator?: User;

  @Field(() => CommunityPost, { nullable: true })
  communityPost?: CommunityPost;

  @Field(() => Community, { nullable: true })
  community?: Community;

  @Field(() => Number, { nullable: true })
  repliesCount?: number;
}
@ObjectType()
export class FirstLevelCommentPagination extends relayTypes<FirstLevelComment>(
  FirstLevelComment,
) {}
