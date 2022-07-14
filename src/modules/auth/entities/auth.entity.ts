import { Field, ObjectType } from '@nestjs/graphql';
import { Company } from 'src/modules/company/entities/company.entity';

import { User } from '../../user/entities/user.entity';
import { Token } from './token.entity';

@ObjectType()
export class Auth extends Token {
  @Field()
  user: User;

  @Field()
  role: string;

  @Field(() => [Company], { nullable: true })
  company?: Company[];
}
