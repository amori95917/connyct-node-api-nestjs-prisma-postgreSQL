import { Field, ObjectType } from '@nestjs/graphql';
import { CustomError } from 'src/common/graphql/types/custom-error';
import { Company } from 'src/modules/company/entities/company.entity';
import { OTP } from 'src/modules/otp-verification/entities/otp.entity';

import { User } from '../../user/entities/user.entity';
import { Token } from './token.entity';

@ObjectType()
export class Auth extends Token {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => User, { nullable: true })
  user?: User;

  @Field({ nullable: true })
  role?: string;

  @Field({ nullable: true })
  otp?: OTP;

  @Field(() => [Company], { nullable: true })
  company?: Company[];
}
