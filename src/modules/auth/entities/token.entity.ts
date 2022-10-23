import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Token {
  @Field({ description: 'JWT access token', nullable: true })
  accessToken?: string;

  @Field({ description: 'JWT refresh token', nullable: true })
  refreshToken?: string;

  emailToken?: string;
  passwordToken?: string;
}
