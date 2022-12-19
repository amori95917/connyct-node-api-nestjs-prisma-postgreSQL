import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload';
import { customError } from 'src/common/errors';
import { FILE_CODE, POST_IMAGE_CODE } from 'src/common/errors/error.code';
import {
  FILE_MESSAGE,
  POST_IMAGE_MESSAGE,
} from 'src/common/errors/error.message';
import { STATUS_CODE } from 'src/common/errors/error.statusCode';
import { generateSlug } from 'src/common/slug/slug.generator';
import { CloudinaryService } from 'src/modules/cloudinary/services/cloudinary.service';
import { Community } from 'src/modules/company-community/entities/community.entity';
import { FileUploadService } from 'src/modules/files/services/file.service';
import { Tag } from 'src/modules/post/entities/tags.entity';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { findManyCursorConnection } from 'src/modules/prisma/resolvers/pagination/relay.pagination';
import {
  CommunityPostInput,
  UpdateCommunityPostInput,
} from '../../dto/post/community-post.input';
import { CommunityPostsOrderList } from '../../dto/post/order-posts.input';
import { CommunityPostMedia } from '../../entities/post/community-post-image.entity';
import { CommunityPost } from '../../entities/post/community-post.entity';
import {
  CommunityPostPayload,
  GetCommunityPostPayload,
} from '../../entities/post/community-post.payload';
import { DeleteCommunityPostPayload } from '../../entities/post/delete-post.payload';
import { UpdateCommunityPostPayload } from '../../entities/post/update-post.payload';

@Injectable()
export class CommunityPostRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUploadService: FileUploadService,
    private cloudinary: CloudinaryService,
  ) {}

  public async findPostById(id: string): Promise<CommunityPost | null> {
    try {
      return this.prisma.communityPost.findFirst({
        where: { id },
      });
    } catch (e) {
      throw new Error(e);
    }
  }
  public async findPostByCreatorId(
    authorId: string,
    postId: string,
  ): Promise<CommunityPost | null> {
    try {
      return this.prisma.communityPost.findFirst({
        where: { authorId, id: postId },
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  public async findPostsByCompanyId(
    communityId: string,
    paginate: ConnectionArgs,
    order: CommunityPostsOrderList,
  ): Promise<GetCommunityPostPayload> {
    try {
      const communityPost = await findManyCursorConnection(
        (args) =>
          this.prisma.communityPost.findMany({
            ...args,
            where: { communityId },
            orderBy: { [order.orderBy]: order.direction },
          }),
        () =>
          this.prisma.communityPost.count({
            where: { communityId },
          }),
        { ...paginate },
      );
      return { communityPost };
    } catch (e) {
      throw new Error(e);
    }
  }

  async communityPostMedia(
    postId: string,
  ): Promise<CommunityPostMedia[] | null> {
    return await this.prisma.communityPostMedia.findMany({
      where: { communityPostId: postId },
    });
  }
  async community(id: string): Promise<Community> {
    return await this.prisma.companyCommunity.findFirst({
      where: { id },
    });
  }

  async create(
    input: CommunityPostInput,
    authorId: string,
    files: FileUpload[],
  ): Promise<CommunityPostPayload> {
    try {
      const result = await this.prisma.$transaction(async () => {
        // let errors;
        // create post
        const post = await this.prisma.communityPost.create({
          data: {
            text: input.text,
            authorId,
            communityId: input.communityId,
            slug: generateSlug(),
          },
        });
        // create tags
        let tags: Tag[];
        /**Execute only if tags exist */
        if (input.tags) {
          tags = await Promise.all(
            input.tags.map(async (tag) => {
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
                communityPostId: post.id,
              },
            });
          });
        }
        /**check if  title exists but not image*/
        if (input.metaTitle || input.description) {
          if (!files)
            return {
              errors: customError(
                FILE_MESSAGE.NOT_FOUND,
                FILE_CODE.NOT_FOUND,
                STATUS_CODE.NOT_FOUND,
              ),
            };
        }
        let postImage: CommunityPostMedia[];
        /**check if file exists */
        if (files) {
          const fileURL = await this.fileUploadService.uploadImage(
            'community-feeds',
            files,
          );
          /**check if errors exists for file type */
          if (fileURL[0].errors) return { errors: fileURL[0].errors };
          // create product
          postImage = await Promise.all(
            fileURL.map(async (imageURL) => {
              return await this.prisma.communityPostMedia.create({
                data: {
                  metaTitle: input.metaTitle,
                  imageURL,
                  description: input.description,
                  communityPostId: post.id,
                },
              });
            }),
          );
        }
        return { post, postImage, tags };
      });
      return {
        errors: result.errors,
        communityPost: result.post,
        communityPostMedia: result.postImage,
        tags: result.tags,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  public async update(
    postId: string,
    imageURL: string,
    input: UpdateCommunityPostInput,
    file: FileUpload,
    post,
  ): Promise<UpdateCommunityPostPayload> {
    try {
      const result = await this.prisma.$transaction(async () => {
        let newPost: CommunityPost;
        if (input.text) {
          newPost = await this.prisma.communityPost.update({
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
                communityPostId: post.id,
              },
            });
          });
        }
        /**post image update */
        let newPostImage: CommunityPostMedia;
        if (imageURL) {
          const postImage = await this.prisma.communityPostMedia.findUnique({
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
              'community-feeds',
              file,
            );
            /**check if errors exists for file type */
            if (responseURL.errors) return { errors: responseURL.errors };
            /**delete existing file from cloudinary */
            await this.fileUploadService.deleteImage(
              'community-feeds',
              this.cloudinary.getPublicId(imageURL),
            );
          }
          newPostImage = await this.prisma.communityPostMedia.update({
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

      return {
        errors: result.errors,
        communityPost: result.newPost,
        communityPostMedia: result.newPostImage,
        tags: result.tags,
      };
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async checkCommunityOwner(id: string, creatorId: string) {
    try {
      return await this.prisma.companyCommunity.findFirst({
        where: { id, creatorId },
      });
    } catch (err) {
      throw new Error(err);
    }
  }
  async checkOwner(communityPostId: string, userId: string): Promise<any> {
    try {
      const communityPost = await this.prisma.communityPost.findFirst({
        where: { id: communityPostId },
        include: {
          community: {
            select: {
              companyId: true,
            },
          },
        },
      });
      const company = await this.prisma.company.findFirst({
        where: { id: communityPost.community.companyId, ownerId: userId },
      });
      if (company) return true;
    } catch (err) {}
  }
  public async delete(postId: string): Promise<DeleteCommunityPostPayload> {
    try {
      await this.prisma.$transaction(async () => {
        /**set isDeleted true in post  */
        await this.prisma.communityPost.delete({
          where: { id: postId },
        });
      });

      return { isDeleteSuccessful: true };
    } catch (e) {
      throw new Error(e);
    }
  }
}
