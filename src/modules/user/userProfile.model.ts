import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../prisma/entities/base.entity';
import { User } from './entities/user.entity';

@ObjectType()
export class UserProfile extends BaseEntity {
  @Field({ nullable: true })
  address: string;

  @Field({ nullable: true })
  phoneNo: string;

  @Field({ nullable: true })
  profileImage: string;

  @Field(() => User, { nullable: true })
  user?: User;
}
