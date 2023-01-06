import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/modules/prisma/entities/base.entity';

@ObjectType()
export class ProductMedia extends BaseEntity {
  @Field({ nullable: true })
  mediaUrl: string;

  @Field({ nullable: true })
  productId: string;
}
