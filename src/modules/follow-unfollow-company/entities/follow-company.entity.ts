import { Field, ID, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';

@ObjectType()
export class FollowCompany extends BaseEntity {
  @Field({ nullable: true })
  followedById: string;

  @Field({ nullable: true })
  followedToId: string;

  @Field({ nullable: true })
  isConnected: boolean;
}
