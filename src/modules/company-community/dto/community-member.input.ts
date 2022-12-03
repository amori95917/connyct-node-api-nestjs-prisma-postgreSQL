import { Field, InputType } from '@nestjs/graphql';
import {
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

@InputType()
export class CommunityMemberInviteInput {
  @Field()
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  communityId: string;

  @Field()
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  companyId: string;

  @Field(() => [String], { nullable: true })
  @IsString({ each: true })
  @ArrayUnique()
  memberId: string[];
}
@InputType()
export class CommunityMemberInput {
  @Field()
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  communityId: string;

  @Field()
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  companyId: string;
}
