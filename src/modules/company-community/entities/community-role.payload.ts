import { Field, ObjectType } from '@nestjs/graphql';
import { CustomError } from 'src/common/graphql/types/custom-error';
import { CommunityRole } from './community-role.entity';

@ObjectType()
export class CommunityRolePayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => CommunityRole, { nullable: true })
  community?: CommunityRole;
}
