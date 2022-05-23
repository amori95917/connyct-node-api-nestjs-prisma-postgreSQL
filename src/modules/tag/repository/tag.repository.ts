import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class TagRepository {
  public constructor(private readonly prisma: PrismaService) {}

  async createTags(tags: string[]) {
    const upsertOperations = tags.map((name) => {
      return this.prisma.tag.upsert({
        where: { name },
        create: { name },
        update: {},
      });
    });
    return Promise.all(upsertOperations);
  }

  async findManyTags(tags: Prisma.TagFindManyArgs) {
    this.prisma.tag.findMany(tags);
  }
}
