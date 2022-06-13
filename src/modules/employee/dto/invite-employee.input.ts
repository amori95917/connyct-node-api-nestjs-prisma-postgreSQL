import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class InvitedEmployeeInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  invitedEmail: string;

  @Field()
  @IsNotEmpty()
  role: string;
}
