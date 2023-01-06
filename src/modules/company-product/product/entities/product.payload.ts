import { Field, ObjectType } from '@nestjs/graphql';
import { CustomError } from 'src/common/graphql/types/custom-error';
import { Product, ProductPaginated } from './product.entity';
import { ProductMedia } from './product-media.entity';
import { ProductAttribute } from './product-attribute.entity';
import { ProductVariation } from './product-variation.entity';

@ObjectType()
export class FindProductPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => ProductPaginated, { nullable: true })
  data?: ProductPaginated;
}

@ObjectType()
export class ProductPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => Product, { nullable: true })
  data?: Product;
}

@ObjectType()
export class ProductMediaPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => [ProductMedia], { nullable: true })
  data?: ProductMedia[];
}
@ObjectType()
export class ProductMediaUpdatePayload {
  // @Field(() => [CustomError], { nullable: true })
  // errors?: CustomError[];

  @Field(() => ProductMedia, { nullable: true })
  data: ProductMedia;
}

@ObjectType()
export class ProductAttributePayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => ProductAttribute, { nullable: true })
  data?: ProductAttribute;
}

@ObjectType()
export class ProductVariationPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => ProductVariation, { nullable: true })
  data?: ProductVariation;
}
