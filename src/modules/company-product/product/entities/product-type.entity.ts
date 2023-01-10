import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';

@ObjectType()
export class ProductType extends BaseEntity {
  @Field()
  name: string;
}
