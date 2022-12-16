import { Field, ObjectType } from '@nestjs/graphql';
import { Community } from 'src/modules/company-community/entities/community.entity';
import { Company } from 'src/modules/company/entities/company.entity';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';
import relayTypes from 'src/modules/prisma/resolvers/pagination/relay.types';
import { CommunityPostMedia } from './community-post-image.entity';
import { User } from 'src/modules/user/entities/user.entity';

@ObjectType()
export class CommunityPost extends BaseEntity {
  @Field({ nullable: true })
  text: string;

  @Field({ nullable: true })
  communityId: string;

  @Field({ nullable: true })
  slug: string;

  @Field({ nullable: true })
  authorId: string;

  @Field({ nullable: true })
  isDeleted: boolean;

  @Field({ nullable: true })
  isApproved: boolean;

  @Field(() => CommunityPostMedia, { nullable: true })
  communityPostMedia?: CommunityPostMedia;

  @Field(() => Community, { nullable: true })
  community?: Community;

  @Field(() => User, { nullable: true })
  creator?: User;
}

@ObjectType()
export class CommunityPostPaginated extends relayTypes<CommunityPost>(
  CommunityPost,
) {}
