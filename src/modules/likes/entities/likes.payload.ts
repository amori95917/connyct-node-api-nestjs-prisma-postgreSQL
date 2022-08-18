import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/modules/user/entities/user.entity';
import { Likes } from '../likes.model';

@ObjectType()
export class LikesPayload {
  @Field(() => [Likes], { nullable: true })
  likes?: Likes[];

  @Field({ nullable: true })
  count?: number;

  @Field(() => [User], { nullable: true })
  reactors?: User[];
}
