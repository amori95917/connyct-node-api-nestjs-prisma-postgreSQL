import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';
import { ProductMedia } from './product-media.entity';
import { ProductAttribute } from './product-attribute.entity';
import { ProductVariation } from './product-variation.entity';
import relayTypes from 'src/modules/prisma/resolvers/pagination/relay.types';
import { ProductCategory } from '../../product-category/entities/product-category.entity';

@ObjectType()
export class Product extends BaseEntity {
  @Field({ nullable: true })
  sku: number;

  @Field({ nullable: true })
  productName: string;

  @Field({ nullable: true })
  price: number;

  @Field({ nullable: true })
  slug: string;

  @Field({ nullable: true })
  companyId: string;

  @Field({ nullable: true })
  categoryId: string;

  @Field(() => ProductCategory, { nullable: true })
  category?: ProductCategory;

  @Field(() => [ProductMedia], { nullable: true })
  productMedia?: ProductMedia[];

  @Field(() => ProductAttribute, { nullable: true })
  productAttribute?: ProductAttribute;

  @Field(() => [ProductVariation], { nullable: true })
  productVariation?: ProductVariation[];
}
@ObjectType()
export class ProductPaginated extends relayTypes<Product>(Product) {}
