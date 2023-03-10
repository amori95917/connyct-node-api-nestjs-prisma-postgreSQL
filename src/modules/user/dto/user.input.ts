import { Field, InputType } from '@nestjs/graphql';

import { IsUUID } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  userId?: string;

  @Field({ nullable: true })
  fullName?: string;
}

@InputType()
export class UpdateStatusUserInput {
  @Field()
  @IsUUID('4')
  userId: string;

  @Field()
  status: boolean;
}

export type UserDataInput = {
  id?: string;
  email: string;
  fullName?: string;
  username?: string;
  password: string;
  emailToken?: string;
  passwordToken?: string;
  confirm?: boolean;
  isValid?: boolean;
  isCompanyAccount?: boolean;
  companyLegalName?: string;
};
