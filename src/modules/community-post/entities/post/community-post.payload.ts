import { Field, ObjectType } from '@nestjs/graphql';
import { CustomError } from 'src/common/graphql/types/custom-error';
import { Tag } from 'src/modules/post/entities/tags.entity';
import { CommunityPostMedia } from './community-post-image.entity';
import { CommunityPost, CommunityPostPaginated } from './community-post.entity';

@ObjectType()
export class CommunityPostPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => CommunityPost, { nullable: true })
  communityPost?: CommunityPost;
}

@ObjectType()
export class GetCommunityPostPayload {
  @Field(() => [CustomError], { nullable: true })
  public errors?: CustomError[] | undefined;

  @Field(() => CommunityPostPaginated, { nullable: true })
  public communityPost?: CommunityPostPaginated;
}
