import { Field, ObjectType } from '@nestjs/graphql';
import { CustomError } from 'src/common/graphql/types/custom-error';
import { Tag } from 'src/modules/post/entities/tags.entity';
import { CommunityPostMedia } from './community-post-image.entity';
import { CommunityPost } from './community-post.entity';

@ObjectType()
export class UpdateCommunityPostPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => CommunityPost, { nullable: true })
  communityPost?: CommunityPost;

  @Field(() => CommunityPostMedia, { nullable: true })
  communityPostMedia?: CommunityPostMedia;

  @Field(() => [Tag], { nullable: true })
  tags?: Tag[];
}
