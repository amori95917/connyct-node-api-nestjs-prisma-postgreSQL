import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';
import { Paginated } from 'src/modules/prisma/resolvers/pagination/pagination';
import { User } from 'src/modules/user/entities/user.entity';

@ObjectType()
export class CommunityPostCommentReaction extends BaseEntity {
  @Field({ nullable: true })
  reactions: string;

  @Field({ nullable: true })
  communityPostCommentId: string;

  @Field({ nullable: true })
  userId: string;

  @Field(() => User, { nullable: true })
  reactor?: User;
}

@ObjectType()
export class CommunityPostCommentReactionsPagination extends Paginated(
  CommunityPostCommentReaction,
) {}
