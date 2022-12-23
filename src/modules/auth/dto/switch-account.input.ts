import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SwitchAccountInput {
  @Field()
  userId: string;

  @Field()
  accountType: AccountType;
}

export enum AccountType {
  BRAND = 'OWNER',
  USER = 'USER',
}
