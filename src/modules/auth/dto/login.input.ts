import { Field, InputType } from '@nestjs/graphql';

import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsString()
  emailOrUsername: string;

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
