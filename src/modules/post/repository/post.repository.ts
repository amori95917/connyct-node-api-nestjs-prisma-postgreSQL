import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/modules/prisma/prisma.service';

import { TagService } from 'src/modules/tag/services/tag.service';
import type { CreatePostInput } from '../dto/create-post.input';
import type { UpdatePostInput } from '../dto/update-post.input';
import type { Post, Prisma } from '@prisma/client';
import { FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';

@Injectable()
export class PostsRepository {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly tagService: TagService,
  ) {}

  public async createPost(
    feedData: CreatePostInput,
    creatorId: string,
    file: FileUpload[],
  ): Promise<Post> {
    try {
      const files = await Promise.all(
        file.map(async (image: FileUpload): Promise<any> => {
          const { createReadStream, filename } = await image;
          const stream = createReadStream();
          const newFileName = Date.now() + filename;
          new Promise(async (resolve, reject) =>
            stream
              .pipe(
                createWriteStream(
                  `./src/modules/post/uploads/feeds/${newFileName}`,
                ),
              )
              .on('error', (err) => {
                console.log('WriteStream Error', err);
                reject('error');
              }),
          );
          return newFileName;
        }),
      );

      const result = await this.prisma.$transaction(async () => {
        // create post
        const post = await this.prisma.post.create({
          data: {
            text: feedData.text,
            creatorId: creatorId,
          },
        });
        // TODO intercept error message and sent graphql friendly error msg
        if (!post) throw new Error('Post not created');
        // create product
        files.forEach(async (fileName) => {
          await this.prisma.product.create({
            data: {
              name: feedData.name,
              description: feedData.description,
              image: fileName,
              postId: post.id,
            },
          });
        });
        // create tags
        const tags = await Promise.all(
          feedData.tags.map(async (tag) => {
            const isTag = await this.prisma.tag.findUnique({
              where: {
                name: tag,
              },
            });
            console.log('tags', tag);
            console.log('tags details', isTag);
            if (isTag) return isTag;
            return await this.prisma.tag.create({
              data: {
                name: tag,
              },
            });
          }),
        );
        console.log('all tags', tags);
        tags.forEach(async (tag) => {
          await this.prisma.tagWithPost.create({
            data: {
              tagsId: tag.id,
              postId: post.id,
            },
          });
        });
        return post;
      });

      return result;
    } catch (e) {
      throw new Error(e);
    }
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
    const tags = input.tags.map((t) => ({
      create: { id: t },
      where: { name: t },
    }));
    // const [existingTags = [], newTags] = await Promise.all([
    //   this.tagService.findManyTags({
    //     select: { id: true },
    //     where: { posts: { every: { id: { equals: postId } } } },
    //   }),
    //   this.tagService.createTags(input.tags || []),
    // ]);
    // return this.prisma.post.update({
    //   where: {
    //     id: postId,
    //   },
    //   data: {
    //     ...input,
    //     tags: {
    //       disconnect: existingTags,
    //       connect: newTags.map((tag) => ({ id: tag.id })),
    //     },
    //   },
    //   include,
    // });
    return;
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
