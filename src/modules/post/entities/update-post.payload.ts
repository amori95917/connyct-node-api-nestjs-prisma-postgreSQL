import { Field, ObjectType } from '@nestjs/graphql';

import { MutationPayload } from '../../../common/graphql/interfaces/mutation-payload';
import { UserError } from '../../../common/graphql/types/user-error';
import { Post } from '../post.models';
import { Product } from './product.entity';
import { Tag } from './tags.entity';

@ObjectType({ implements: () => [MutationPayload] })
export class UpdatePostPayload implements MutationPayload {
  @Field(() => [UserError], { nullable: true })
  public errors?: UserError[] | undefined;

  @Field(() => Post, { nullable: true })
  public post?: Post | null;

  @Field(() => Product, { nullable: true })
  product?: Product;

  @Field(() => [Tag], { nullable: true })
  tags?: Tag[];
}
