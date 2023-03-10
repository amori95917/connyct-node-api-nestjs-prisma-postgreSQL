import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class UnfollowCompanyInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  companyId: string;
}
