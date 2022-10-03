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
import { PostImage } from '../entities/post-image.entity';
import { FileUploadService } from 'src/modules/files/services/file.service';
import { UpdatePostInput } from '../dto/update-post.input';
import { CloudinaryService } from 'src/modules/cloudinary/services/cloudinary.service';
import { CustomError } from 'src/common/graphql/types/custom-error';
import { customError } from 'src/common/errors';
import {
  FILE_MESSAGE,
  POST_IMAGE_MESSAGE,
} from 'src/common/errors/error.message';
import { FILE_CODE, POST_IMAGE_CODE } from 'src/common/errors/error.code';
import { STATUS_CODE } from 'src/common/errors/error.statusCode';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { findManyCursorConnection } from 'src/modules/prisma/resolvers/pagination/relay.pagination';
import { PostPagination } from '../post.models';

@Injectable()
export class PostsRepository {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly tagService: TagService,
    private readonly fileUploadService: FileUploadService,
    private cloudinary: CloudinaryService,
  ) {}

  public async createPost(
    feedData: CreatePostInput,
    companyId: string,
    creatorId: string,
    files: FileUpload[],
  ): Promise<CreatePostPayload> {
    try {
      const result = await this.prisma.$transaction(async () => {
        // let errors;
        // create post
        const post = await this.prisma.post.create({
          data: {
            text: feedData.text,
            creatorId: creatorId,
            companyId,
          },
        });
        // create tags
        let tags: Tag[];
        /**Execute only if tags exist */
        if (feedData.tags) {
          tags = await Promise.all(
            feedData.tags.map(async (tag) => {
              /**find tags */
              const isTag = await this.prisma.tag.findUnique({
                where: {
                  name: tag,
                },
              });
              /**if tags exist return tags */
              if (isTag) return isTag;
              /**create tag */
              return await this.prisma.tag.create({
                data: {
                  name: tag,
                },
              });
            }),
          );
          /**create tagsId and postId in table tagWithPost */
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
        /**check if  title exists but not image*/
        if (feedData.metaTitle || feedData.description) {
          if (!files)
            return {
              errors: customError(
                FILE_MESSAGE.NOT_FOUND,
                FILE_CODE.NOT_FOUND,
                STATUS_CODE.NOT_FOUND,
              ),
            };
        }
        let postImage: PostImage[];
        /**check if file exists */
        if (files) {
          const fileURL = await this.fileUploadService.uploadImage(
            'company-feeds',
            files,
          );
          /**check if errors exists for file type */
          if (fileURL[0].errors) return { errors: fileURL[0].errors };
          // create product
          postImage = await Promise.all(
            fileURL.map(async (imageURL) => {
              return await this.prisma.postImage.create({
                data: {
                  metaTitle: feedData.metaTitle,
                  imageURL,
                  description: feedData.description,
                  postId: post.id,
                },
              });
            }),
          );
        }
        return { post, postImage, tags };
      });
      /**if errors exist in transaction return errors else return data*/
      if (result.errors) return { errors: result.errors.errors };
      return {
        post: result.post,
        tags: result.tags,
        postImage: result.postImage,
      };
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
    imageURL: string,
    input: UpdatePostInput,
    file: FileUpload,
    post: Post,
  ): Promise<UpdatePostPayload> {
    try {
      const result = await this.prisma.$transaction(async () => {
        let newPost: Post;
        if (input.text) {
          newPost = await this.prisma.post.update({
            where: {
              id: postId,
            },
            data: {
              ...post,
              text: input.text,
            },
          });
        }
        /** update tags*/
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
            /**delete tags associated with post id */
            await this.prisma.tagWithPost.deleteMany({
              where: { id: tag.id, postId: postId },
            });
            /**create new tags */
            await this.prisma.tagWithPost.create({
              data: {
                tagsId: tag.id,
                postId: post.id,
              },
            });
          });
        }
        /**post image update */
        let newPostImage: PostImage;
        if (imageURL) {
          const postImage = await this.prisma.postImage.findUnique({
            where: {
              imageURL,
            },
          });
          if (!postImage)
            return {
              errors: customError(
                POST_IMAGE_MESSAGE.NOT_FOUND,
                POST_IMAGE_CODE.NOT_FOUND,
                STATUS_CODE.NOT_FOUND,
              ),
            };
          let responseURL;
          if (file) {
            /**add new file to cloudinary */
            responseURL = await this.fileUploadService.uploadImage(
              'company-feeds',
              file,
            );
            /**check if errors exists for file type */
            if (responseURL.errors) return { errors: responseURL.errors };
            /**delete existing file from cloudinary */
            await this.fileUploadService.deleteImage(
              'company-feeds',
              this.cloudinary.getPublicId(imageURL),
            );
          }
          newPostImage = await this.prisma.postImage.update({
            where: {
              imageURL,
            },
            data: {
              ...postImage,
              metaTitle: input.metaTitle,
              description: input.description,
              imageURL: responseURL,
            },
          });
        }
        return { newPost, tags, newPostImage };
      });
      /**if errors exist in transaction return errors else return data*/
      if (result.errors) return { errors: result.errors.errors };
      return {
        post: result.newPost,
        postImage: result.newPostImage,
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
      await this.prisma.$transaction(async () => {
        /**set isDeleted true in post  */
        await this.prisma.post.update({
          where: { id: postId },
          data: {
            isDeleted: true,
          },
        });
        /**set isDeleted true in postImage  */
        const postImage = await this.prisma.postImage.findMany({
          where: { postId },
        });
        if (postImage.length) {
          postImage.map(
            async (postImg) =>
              await this.prisma.postImage.update({
                where: { id: postImg.id },
                data: {
                  isDeleted: true,
                },
              }),
          );
        }
      });

      return { isDeleteSuccessful: true };
    } catch (e) {
      throw new Error(e);
    }
  }
  public async findPostsByCompanyId(
    companyId: string,
    paginate: ConnectionArgs,
  ) {
    try {
      const baseArgs = {
        where: { companyId, isDeleted: false },
        // orderBy: { [order.orderBy]: order.direction },
      };
      const posts = await findManyCursorConnection(
        (args) => this.prisma.post.findMany({ ...args, ...baseArgs }),
        () => this.prisma.post.count({ where: baseArgs.where }),
        { ...paginate },
      );
      if (!posts.totalCount) return [];
      return posts;
    } catch (e) {
      throw new Error(e);
    }
  }

  public async findPostImage(postId: string): Promise<PostImage[]> {
    try {
      return await this.prisma.postImage.findMany({
        where: { postId: postId, isDeleted: false },
      });
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
      const followedIds = followedCompany.map(
        (company) => company.followedToId,
      );

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

  public async findCompanyPostImageFollowedByUser(
    postId: string,
  ): Promise<PostImage[]> {
    try {
      return this.findPostImage(postId);
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
