import { Field, InputType } from '@nestjs/graphql';

import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

@InputType()
export class SignupInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  fullName?: string;

  @Field(() => String)
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @Length(8, 35, { message: 'password must be between 8 to 35 characters' })
  password: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isCompanyAccount: boolean;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(3, 35, {
    message: 'Company name must be between 3 to 35 characters',
  })
  legalName: string;
}
