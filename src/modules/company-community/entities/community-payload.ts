import { Field, ObjectType } from '@nestjs/graphql';
import { CustomError } from 'src/common/graphql/types/custom-error';
import { Community } from './community.entity';

@ObjectType()
export class CommunityPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => Community, { nullable: true })
  community?: Community;
}
@ObjectType()
export class GetCommunityPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => [Community], { nullable: true })
  community?: Community[];
}
@ObjectType()
export class CommunityDeletePayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => Boolean, { nullable: true })
  isDeleted?: boolean;
}
