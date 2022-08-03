import { UpdatePostPayload } from './../entities/update-post.payload';
import { CreatePostPayload } from './../entities/create-post.payload';
import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/modules/prisma/prisma.service';

import { TagService } from 'src/modules/tag/services/tag.service';
import type { CreatePostInput } from '../dto/create-post.input';
import type { Post, Prisma, Product } from '@prisma/client';
import { FileUpload } from 'graphql-upload';
import { createWriteStream, unlink } from 'fs';
import { DeletePostPayload } from '../entities/delete-post.payload';
import { Tag } from '../entities/tags.entity';

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
  ): Promise<CreatePostPayload> {
    try {
      const result = await this.prisma.$transaction(async () => {
        // create post
        const post = await this.prisma.post.create({
          data: {
            text: feedData.text,
            creatorId: creatorId,
            companyId: feedData.companyId,
          },
        });
        // create tags
        let tags: Tag[];
        if (feedData.tags) {
          tags = await Promise.all(
            feedData.tags.map(async (tag) => {
              const isTag = await this.prisma.tag.findUnique({
                where: {
                  name: tag,
                },
              });
              if (isTag) return isTag;
              return await this.prisma.tag.create({
                data: {
                  name: tag,
                },
              });
            }),
          );
          tags.forEach(async (tag) => {
            await this.prisma.tagWithPost.create({
              data: {
                tagsId: tag.id,
                postId: post.id,
              },
            });
          });
        }
        // TODO intercept error message and sent graphql friendly error msg
        if (feedData.name || feedData.description) {
          if (!file) throw new Error('Image is required');
        }
        let product: Product[];
        if (file) {
          const regax = /(\.jpg|\.jpeg|\.bmp|\.gif|\.png)$/i;
          const files = await Promise.all(
            file.map(async (image: FileUpload): Promise<any> => {
              const { createReadStream, filename } = await image;
              if (!regax.exec(filename)) {
                throw new Error('File extension not supported!');
              }
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

          // create product
          product = await Promise.all(
            files.map(async (fileName) => {
              return await this.prisma.product.create({
                data: {
                  name: feedData.name,
                  description: feedData.description,
                  image: fileName,
                  postId: post.id,
                },
              });
            }),
          );
        }
        return { post, product, tags };
      });

      return { post: result.post, tags: result.tags, product: result.product };
    } catch (e) {
      throw new Error(e);
    }
  }

  public async findPostById(postId: string): Promise<Post | null> {
    try {
      return this.prisma.post.findUnique({ where: { id: postId } });
    } catch (e) {
      throw new Error(e);
    }
  }

  public async findPostByCreatorId(
    creatorId: string,
    postId: string,
  ): Promise<Post | null> {
    try {
      return this.prisma.post.findFirst({ where: { creatorId, id: postId } });
    } catch (e) {
      throw new Error(e);
    }
  }

  public async findPostsByUserId(id: string): Promise<Post[]> {
    try {
      return this.prisma.post.findMany({
        where: { creatorId: id },
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  public async findPosts(): Promise<Post[]> {
    try {
      return this.prisma.post.findMany();
    } catch (e) {
      throw new Error(e);
    }
  }

  public async findPostsByIds(keys: readonly string[]): Promise<Post[]> {
    try {
      return this.prisma.post.findMany({
        where: {
          id: {
            in: [...keys],
          },
        },
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  public async updatePost(
    postId: string,
    productId: string,
    input: CreatePostInput,
    file: FileUpload,
  ): Promise<UpdatePostPayload> {
    try {
      const result = await this.prisma.$transaction(async () => {
        const post = await this.findPostById(postId);
        const newPost = await this.prisma.post.update({
          where: {
            id: postId,
          },
          data: {
            ...post,
            text: input.text,
          },
        });
        // create tags
        let tags: Tag[];
        if (input.tags) {
          tags = await Promise.all(
            input.tags.map(async (tag) => {
              const isTag = await this.prisma.tag.findUnique({
                where: {
                  name: tag,
                },
              });
              if (isTag) return isTag;
              return await this.prisma.tag.create({
                data: {
                  name: tag,
                },
              });
            }),
          );
          tags.forEach(async (tag) => {
            await this.prisma.tagWithPost.deleteMany({
              where: { id: tag.id, postId: postId },
            });
            await this.prisma.tagWithPost.create({
              data: {
                tagsId: tag.id,
                postId: post.id,
              },
            });
          });
        }
        // product edit
        const product = await this.prisma.product.findFirst({
          where: {
            id: productId,
          },
        });
        if (!product) throw new Error('Product not found');
        if (input.name || input.description) {
          if (!file) throw new Error('Image is required');
        }
        const regax = /(\.jpg|\.jpeg|\.bmp|\.gif|\.png)$/i;
        const { createReadStream, filename } = await file;
        if (!regax.exec(filename))
          throw new Error('File extension not supported');
        const stream = createReadStream();
        const newFileName = Date.now() + filename;
        new Promise(async (resolve, reject) => {
          unlink(`./src/modules/post/uploads/feeds/${product.image}`, (e) => {
            console.log('delete file error', e);
          });
          stream.pipe(
            createWriteStream(
              `./src/modules/post/uploads/feeds/${newFileName}`,
            ).on('error', (e) => {
              console.log('write stream error', e);
              reject('error');
            }),
          );
        });
        const newProduct = await this.prisma.product.update({
          where: {
            id: productId,
          },
          data: {
            ...product,
            name: input.name,
            description: input.description,
            image: newFileName,
          },
        });

        return { newPost, tags, newProduct };
      });
      return {
        post: result.newPost,
        product: result.newProduct,
        tags: result.tags,
      };
    } catch (e) {
      throw new Error(e.message);
    }
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

  public async deletePostById(postId: string): Promise<DeletePostPayload> {
    try {
      await this.prisma.post.update({
        where: { id: postId },
        data: { isDeleted: true },
      });
      return { isDeleteSuccessful: true };
    } catch (e) {
      throw new Error(e);
    }
  }
  public async findPostsByCompanyId(companyId: string): Promise<Post[]> {
    try {
      const post = await this.prisma.post.findMany({
        where: { companyId },
      });
      if (!post.length)
        throw new Error('posts doesnot exits in related company');
      return post;
    } catch (e) {
      throw new Error(e);
    }
  }

  public async findProducts(postId: string): Promise<Product[]> {
    try {
      return await this.prisma.product.findMany({ where: { postId: postId } });
    } catch (e) {
      throw new Error(e);
    }
  }

  public async findTags(postId: string): Promise<Tag[] | null> {
    try {
      const tagWithPost = await this.prisma.tagWithPost.findMany({
        where: { postId: postId },
        include: {
          tags: true,
        },
      });
      const tags = tagWithPost.map((tag) => tag.tags);
      return tags;
    } catch (e) {
      throw new Error(e);
    }
  }
  public async findCompanyPostsFollowedByUser(
    userId: string,
  ): Promise<Post[] | null> {
    try {
      const followedCompany = await this.prisma.followUnfollowCompany.findMany({
        where: { followedById: userId },
        select: { followedToId: true },
      });
      if (!followedCompany.length) return null;
      console.log('follow', followedCompany);
      const followedIds = followedCompany.map(
        (company) => company.followedToId,
      );
      console.log('followId', followedIds);

      const posts = await this.prisma.post.findMany({
        where: {
          companyId: { in: followedIds },
        },
      });
      if (!posts.length) return null;
      return posts;
    } catch (e) {
      throw new Error(e);
    }
  }

  public async findCompanyPostProductsFollowedByUser(
    postId: string,
  ): Promise<Product[]> {
    try {
      console.log('postId incoming', postId);
      return this.findProducts(postId);
    } catch (e) {
      throw new Error(e);
    }
  }
  public async findCompanyPostTagsFollowedByUser(
    postId: string,
  ): Promise<Tag[]> {
    try {
      return this.findTags(postId);
    } catch (e) {
      throw new Error(e);
    }
  }
}
