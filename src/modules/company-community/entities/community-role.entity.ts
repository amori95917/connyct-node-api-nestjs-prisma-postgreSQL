import { Field, ObjectType } from '@nestjs/graphql';
import { Company } from 'src/modules/company/entities/company.entity';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Community } from './community.entity';

@ObjectType()
export class CommunityRole extends BaseEntity {
  @Field({ nullable: true })
  role: string;

  @Field({ nullable: true })
  communityId: string;

  @Field({ nullable: true })
  userId: string;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => Community, { nullable: true })
  community?: Community;

  @Field(() => Company, { nullable: true })
  company?: Company;
}
