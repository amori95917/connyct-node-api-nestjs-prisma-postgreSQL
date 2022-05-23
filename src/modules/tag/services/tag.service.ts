import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { TagRepository } from '../repository/tag.repository';

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

  findManyTags(args?: Prisma.TagFindManyArgs) {
    return this.tagRepository.findManyTags(args);
  }
}
