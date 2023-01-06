import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';

@ObjectType()
export class ProductVariation extends BaseEntity {
  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  sku: number;

  @Field({ nullable: true })
  price: number;

  @Field({ nullable: true })
  size: string;

  @Field({ nullable: true })
  color: string;

  @Field({ nullable: true })
  isAvailable: boolean;

  @Field({ nullable: true })
  productId: string;
}
