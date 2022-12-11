import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';
import { CommunityPost } from './community-post.entity';

@ObjectType()
export class CommunityPostMedia extends BaseEntity {
  @Field({ nullable: true })
  metaTitle: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  imageURL: string;

  @Field({ nullable: true })
  communityPostId: string;

  @Field(() => CommunityPost, { nullable: true })
  communityPost?: CommunityPost;
}
