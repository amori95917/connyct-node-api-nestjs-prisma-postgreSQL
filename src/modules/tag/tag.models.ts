import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Paginated } from '../prisma/resolvers/pagination/pagination';

// @ObjectType()
// export class Tag {
//   @Field(() => ID)
//   id: string;

//   @Field()
//   name: string;
// }

import { Tag } from '../post/entities/tags.entity';

@ObjectType()
export class TagPagination extends Paginated(Tag) {}
