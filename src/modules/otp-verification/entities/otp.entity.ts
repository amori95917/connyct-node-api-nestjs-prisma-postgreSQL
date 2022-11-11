import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';

@ObjectType()
export class OTP extends BaseEntity {
  @Field({ nullable: true })
  otp: number;

  @Field({ nullable: true })
  expirationDate: Date;

  @Field({ nullable: true })
  userId: string;
}
