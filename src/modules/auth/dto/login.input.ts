import { Field, InputType } from '@nestjs/graphql';

import { IsEmail } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  emailOrUsername: string;

  @Field()
  password: string;
}

@InputType()
export class LoginLinkAccessInput {
  @Field()
  @IsEmail()
  email: string;
}
