import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';

@ObjectType()
export class ProductAttribute extends BaseEntity {
  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  specification: string;

  @Field({ nullable: true })
  productVariationId: string;

  @Field({ nullable: true })
  productId: string;
}
