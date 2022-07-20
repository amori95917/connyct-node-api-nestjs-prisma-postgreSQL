import { Role } from 'src/modules/auth/enum/role.enum';
import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class InvitedEmployeeInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  invitedEmail: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @IsEnum(Role)
  role: Role;
}
