import { Field, InputType } from '@nestjs/graphql';

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  @IsString()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;
}

@InputType()
export class LoginLinkAccessInput {
  @Field()
  @IsEmail()
  email: string;
}
