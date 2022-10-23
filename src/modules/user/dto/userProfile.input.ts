import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class UserProfileInput {
  @Field()
  @IsOptional()
  @IsString()
  address: string;

  @Field()
  @IsOptional()
  @IsString()
  phoneNo: string;
}
