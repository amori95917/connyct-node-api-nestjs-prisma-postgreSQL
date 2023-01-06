import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';

@ObjectType()
export class ProductCategory extends BaseEntity {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  parentId: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  image: string;

  @Field({ nullable: true })
  isRoot: boolean;

  @Field({ nullable: true })
  isLeaf: boolean;

  @Field({ nullable: true })
  level: number;

  @Field(() => [ProductCategory], { nullable: true })
  subCategory?: ProductCategory[];

  // @Field(() => ProductCategory, { nullable: true })
  // subCategory?: ProductCategory;
}
