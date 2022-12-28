import { Field, ObjectType } from '@nestjs/graphql';
import { CustomError } from 'src/common/graphql/types/custom-error';
import { ProductCategory } from './product-category.entity';

@ObjectType()
export class ProductCategoryPayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => ProductCategory, { nullable: true })
  data?: ProductCategory;
}
@ObjectType()
export class ProductCategoryDeletePayload {
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];

  @Field(() => Boolean, { nullable: true })
  isDeleted?: boolean;
}
