import { Args, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { OrderTagList } from '../dto/create-tag.input';
import { TagService } from '../services/tag.service';
import { Tag } from '../../post/entities/tags.entity';
import { TagPagination } from '../tag.models';

@Resolver(() => Tag)
export class TagResolver {
  public constructor(
    private readonly tagService: TagService, // private readonly commentsLoader: CommentsLoader,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => TagPagination)
  async getTags(
    @Args('paginate', { nullable: true, defaultValue: { skip: 0, take: 50 } })
    paginate: PaginationArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { order: 'createdAt', direction: 'asc' }, // need to filter by total usage
    })
    order: OrderTagList,
  ) {
    return this.tagService.findManyTags(paginate, order);
  }
}
