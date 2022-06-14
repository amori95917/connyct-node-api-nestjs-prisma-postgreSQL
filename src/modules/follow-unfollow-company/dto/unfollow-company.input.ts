import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UnfollowCompanyInput {
  @Field()
  @IsNotEmpty()
  companyId: string;
}
