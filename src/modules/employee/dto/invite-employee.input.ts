import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class InvitedEmployeeInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  invitedEmail: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  role: string;
}
