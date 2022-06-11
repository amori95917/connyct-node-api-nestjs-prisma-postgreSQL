import { Field, InputType } from '@nestjs/graphql';

import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

@InputType()
export class SignupInput {
  @Field()
  @IsNotEmpty()
  firstName: string;

  @Field()
  @IsNotEmpty()
  lastName: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field({ nullable: true })
  @IsOptional()
  username: string;

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  isCompanyAccount: boolean;

  @Field({ nullable: true })
  @IsOptional()
  legalName: string;
}
