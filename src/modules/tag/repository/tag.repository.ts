import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { haveNextPage } from 'src/modules/prisma/resolvers/pagination/pagination';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';
import { OrderTagList } from '../dto/create-tag.input';

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

  async findManyTags(
    paginate: PaginationArgs,
    order: OrderTagList,
    // tags: Prisma.TagFindManyArgs,
  ) {
    const nodes = await this.prisma.tag.findMany({
      skip: paginate.skip,
      take: paginate.take,
      orderBy: { [order.orderBy]: order.direction },
    });
    const totalCount = await this.prisma.tag.count();
    const hasNextPage = haveNextPage(paginate.skip, paginate.take, totalCount);
    return {
      nodes,
      totalCount,
      hasNextPage,
      edges: nodes?.map((node) => ({
        node,
        cursor: Buffer.from(node.id).toString('base64'),
      })),
    };
  }
}
