import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

@InputType()
export class UserEmployeeInput {
  @Field()
  @IsBoolean()
  @IsNotEmpty()
  isInviteAccepted: boolean;

  @Field()
  @IsNotEmpty()
  @MinLength(3)
  @IsString()
  firstName: string;

  @Field()
  @IsNotEmpty()
  @MinLength(3)
  @IsString()
  lastName: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be atleast 8 character long' })
  @IsString()
  password: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  role: string;
}
