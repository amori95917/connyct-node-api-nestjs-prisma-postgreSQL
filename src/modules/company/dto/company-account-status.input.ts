import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

enum AccountStatus {
  APPROVED = 'APPROVED',
  REVIEW = 'REVIEW',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

@InputType()
export class CompanyAccountStatus {
  @Field()
  @IsNotEmpty()
  @IsEnum(AccountStatus)
  accountStatus: AccountStatus;

  @Field({ nullable: true })
  @IsOptional()
  reason: string;
}
