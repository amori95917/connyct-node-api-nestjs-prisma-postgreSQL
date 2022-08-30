import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';
import { Paginated } from '../prisma/resolvers/pagination/pagination';
import { User } from '../user/entities/user.entity';
import { Reactions } from './entities/reactions.entity';
@ObjectType()
export class Likes extends BaseEntity {
  @Field()
  postId: string;

  @Field()
  reactionId: string;

  @Field()
  userId: string;

  @Field(() => Reactions, { nullable: true })
  reactions?: Reactions;

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class ReactionsPagination extends Paginated(Likes) {}
