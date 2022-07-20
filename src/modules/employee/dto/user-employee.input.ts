import { Role } from 'src/modules/auth/enum/role.enum';
import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

@InputType()
export class UserEmployeeInput {
  @Field(() => Boolean)
  @IsBoolean()
  @IsNotEmpty()
  isInviteAccepted: boolean;

  @Field(() => String)
  @IsNotEmpty()
  @Length(3, 35, { message: 'firstname must be between 3 to 35 characters' })
  @IsString()
  firstName: string;

  @Field(() => String)
  @IsNotEmpty()
  @Length(3, 35, { message: 'lastname must be between 3 to 35' })
  @IsString()
  lastName: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  @Length(8, 35, { message: 'Password must be atleast 8 character long' })
  @IsString()
  password: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @IsEnum(Role)
  role: Role;
}
