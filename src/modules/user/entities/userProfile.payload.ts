import { Field, ObjectType } from '@nestjs/graphql';
import { CustomError } from 'src/common/graphql/types/custom-error';
import { UserProfile } from '../userProfile.model';

@ObjectType()
export class UserProfilePayload {
  @Field(() => CustomError, { nullable: true })
  errors?: CustomError[];

  @Field(() => UserProfile, { nullable: true })
  userProfile?: UserProfile;
}
