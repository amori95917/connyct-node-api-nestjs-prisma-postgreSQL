import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class UserEmployeeInput {
  @Field()
  @IsBoolean()
  @IsNotEmpty()
  isInviteAccepted: boolean;

  @Field()
  @IsNotEmpty()
  @MinLength(3)
  firstName: string;

  @Field()
  @IsNotEmpty()
  @MinLength(3)
  lastName: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be atleast 8 character long' })
  password: string;

  @Field()
  @IsNotEmpty()
  role: string;
}
