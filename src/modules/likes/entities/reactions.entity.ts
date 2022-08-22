import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';

@ObjectType()
export class Reactions extends BaseEntity {
  @Field()
  reactionType: string;
}
