import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../prisma/entities/base.entity';
import relayTypes from 'src/modules/prisma/resolvers/pagination/relay.types';
import { UserProfile } from '../userProfile.model';

@ObjectType()
export class ConnectedUser extends BaseEntity {
  @Field({ nullable: true })
  fullName: string;

  @Field({ nullable: true })
  username: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  isValid: boolean;

  @Field(() => UserProfile, { nullable: true })
  userProfile?: UserProfile;
}

@ObjectType()
export class ConnectedUserPaginated extends relayTypes<ConnectedUser>(
  ConnectedUser,
) {}
