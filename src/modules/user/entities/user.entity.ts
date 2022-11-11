import { Company } from 'src/modules/company/entities/company.entity';
import { Field, HideField, ObjectType, ID } from '@nestjs/graphql';

import { Role } from 'src/modules/auth/entities/role.entity';
import { Paginated } from 'src/modules/prisma/resolvers/pagination/pagination';

import { BaseEntity } from '../../prisma/entities/base.entity';
import { Post } from '../../post/post.models';
import relayTypes from 'src/modules/prisma/resolvers/pagination/relay.types';

@ObjectType()
export class User extends BaseEntity {
  @Field({ nullable: true })
  fullName: string;

  @Field({ nullable: true })
  username: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  isValid: boolean;

  @HideField()
  password: string;

  roles?: Role[];

  @Field({ nullable: true })
  isSuperuser?: boolean;

  @Field({ nullable: true })
  confirm: boolean;

  @Field({ nullable: true })
  emailToken: string;

  @Field({ nullable: true })
  isEmailVerified: boolean;

  @Field(() => [Post], { nullable: true })
  public posts?: Post[];

  @Field(() => [Company], { nullable: true })
  company?: Company[];
}

@ObjectType()
export class UserPaginated extends relayTypes<User>(User) {}
