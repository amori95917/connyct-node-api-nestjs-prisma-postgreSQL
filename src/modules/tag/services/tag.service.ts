import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';
import { TagRepository } from '../repository/tag.repository';
import { OrderTagList } from '../dto/create-tag.input';

/**
 * Service for manage tags.
 */
@Injectable()
export class TagService {
  public constructor(private readonly tagRepository: TagRepository) {}

  /**
   * Create tags (if not exists) from array of strings.
   */
  async createTags(tags: string[]) {
    return this.tagRepository.createTags(tags);
  }

  findManyTags(
    paginate: PaginationArgs,
    order: OrderTagList,
    // args?: Prisma.TagFindManyArgs,
  ) {
    return this.tagRepository.findManyTags(paginate, order);
  }
}
