import { Field, ObjectType } from '@nestjs/graphql';
import { CustomError } from 'src/common/graphql/types/custom-error';
import { OTP } from './otp.entity';

@ObjectType()
export class OTPPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => OTP, { nullable: true })
  otp?: OTP;

  @Field({ nullable: true })
  otpCheck?: boolean;
}
