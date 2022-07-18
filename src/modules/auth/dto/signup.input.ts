import { Field, InputType } from '@nestjs/graphql';

import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

@InputType()
export class SignupInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  username: string;

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isCompanyAccount: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  legalName: string;
}
