import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';
import { Paginated } from 'src/modules/prisma/resolvers/pagination/pagination';
import { User } from 'src/modules/user/entities/user.entity';
import { CommunityPost } from '../post/community-post.entity';

@ObjectType()
export class Reaction extends BaseEntity {
  @Field({ nullable: true })
  communityPostId: string;

  @Field({ nullable: true })
  userId: string;

  @Field({ nullable: true })
  reactions: string;

  @Field(() => User, { nullable: true })
  reactor?: User;

  @Field(() => CommunityPost, { nullable: true })
  communityPost?: CommunityPost;
}

@ObjectType()
export class CommunityPostReactionsPagination extends Paginated(Reaction) {}
