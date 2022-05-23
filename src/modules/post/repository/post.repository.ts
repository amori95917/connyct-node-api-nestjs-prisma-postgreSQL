import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/modules/prisma/prisma.service';

import { TagService } from 'src/modules/tag/services/tag.service';
import type { CreatePostInput } from '../dto/create-post.input';
import type { UpdatePostInput } from '../dto/update-post.input';
import type { Post, Prisma } from '@prisma/client';

@Injectable()
export class PostsRepository {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly tagService: TagService,
  ) {}

  public async createPost(
    input: CreatePostInput,
    creatorId: string,
  ): Promise<Post> {
    return this.prisma.post.create({
      data: {
        ...input,
        creatorId,
      },
    });
  }

  public async findPostById(postId: string): Promise<Post | null> {
    return this.prisma.post.findUnique({ where: { id: postId } });
  }

  public async findPostByCreatorId(
    creatorId: string,
    postId: string,
  ): Promise<Post | null> {
    return this.prisma.post.findFirst({ where: { creatorId, id: postId } });
  }

  public async findPostsByUserId(id: string): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: { creatorId: id },
    });
  }

  public async findPosts(): Promise<Post[]> {
    return this.prisma.post.findMany();
  }

  public async findPostsByIds(keys: readonly string[]): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: {
        id: {
          in: [...keys],
        },
      },
    });
  }

  public async updatePost(
    postId: string,
    input: UpdatePostInput,
    include?: Prisma.PostInclude,
  ): Promise<Post | null> {
    // const tags = input.tags.map((t) => ({
    //   create: { id: t },
    //   where: { name: t },
    // }));
    const [existingTags = [], newTags] = await Promise.all([
      this.tagService.findManyTags({
        select: { id: true },
        where: { posts: { every: { id: { equals: postId } } } },
      }),
      this.tagService.createTags(input.tags || []),
    ]);
    return this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        ...input,
        tags: {
          disconnect: existingTags,
          connect: newTags.map((tag) => ({ id: tag.id })),
        },
      },
      include,
    });
  }

  public async incrementRatingById(
    postId: string,
    incrementRating: number,
  ): Promise<void> {
    await this.prisma.post.update({
      data: {
        rating: {
          increment: incrementRating,
        },
      },
      where: {
        id: postId,
      },
    });
  }

  public async deletePostById(postId: string): Promise<void> {
    await this.prisma.post.delete({ where: { id: postId } });
  }
}
