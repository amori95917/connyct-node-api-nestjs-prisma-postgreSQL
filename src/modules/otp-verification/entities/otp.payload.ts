import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OTPPayload {
  @Field({ nullable: true })
  otpCheck: boolean;
}
