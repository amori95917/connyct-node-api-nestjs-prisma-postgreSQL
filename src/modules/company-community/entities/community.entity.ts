import { Field, ObjectType } from '@nestjs/graphql';
import { Company } from 'src/modules/company/entities/company.entity';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { CommunityRole } from './community-role.entity';

@ObjectType()
export class Community extends BaseEntity {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  type: string;

  @Field({ nullable: true })
  profile: string;

  @Field({ nullable: true })
  companyId: string;

  @Field({ nullable: true })
  creatorId: string;

  @Field({ nullable: true })
  slug: string;

  @Field(() => Company, { nullable: true })
  company?: Company;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [CommunityRole], { nullable: true })
  communityRole?: CommunityRole[];
}
