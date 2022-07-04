import { Field, ObjectType } from '@nestjs/graphql';
import { Company, User } from '@prisma/client';

@ObjectType()
export class UserPayload {
  @Field()
  user: User;

  @Field()
  companyId?: string;

  @Field()
  legalName?: string;
}
