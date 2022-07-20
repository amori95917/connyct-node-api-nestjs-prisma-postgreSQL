import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../prisma/entities/base.entity';

@ObjectType()
export class Industry extends BaseEntity {
  @Field()
  type: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  isActive: boolean;
}
