import { Injectable, NotFoundException } from '@nestjs/common';

import { PostsRepository } from '../repository/post.repository';

import type { CreatePostInput } from '../dto/create-post.input';
import type { CreatePostPayload } from '../entities/create-post.payload';
import type { DeletePostPayload } from '../entities/delete-post.payload';
import type { UpdatePostPayload } from '../entities/update-post.payload';
import type { Post, PostPagination } from '../post.models';
import { FileUpload } from 'graphql-upload';
import { Product } from '../entities/product.entity';
import { Tag } from '../entities/tags.entity';
import { customError } from 'src/common/errors';
import { COMPANY_MESSAGE, POST_MESSAGE } from 'src/common/errors/error.message';
import { COMPANY_CODE, POST_CODE } from 'src/common/errors/error.code';
import { STATUS_CODE } from 'src/common/errors/error.statusCode';
import { CompanyService } from 'src/modules/company/services/company.service';
import { UpdatePostInput } from '../dto/update-post.input';
import { PostImage } from '../entities/post-image.entity';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { OrderPosts } from '../dto/order-posts.input';
import { ApolloError } from 'apollo-server-express';

@Injectable()
export class PostsService {
  public constructor(
    private readonly postsRepository: PostsRepository,
    private readonly companyService: CompanyService,
  ) {}

  // public async getPostById(id: string): Promise<Post> {
  //   const post = await this.postsRepository.findPostById(id);
  //   if (!post) {
  //     throw new NotFoundException('Post not found');
  //   }
  //   return post;
  // }

  public async createPost(
    feedData: CreatePostInput,
    companyId: string,
    file: FileUpload[],
    creatorId: string,
  ): Promise<CreatePostPayload> {
    try {
      /**if check if company exists*/
      if (companyId) {
        const company = await this.companyService.getCompanyById(companyId);
        if (!company)
          throw new ApolloError(
            COMPANY_MESSAGE.NOT_FOUND,
            COMPANY_CODE.NOT_FOUND,
            { statusCode: STATUS_CODE.NOT_FOUND },
          );
      }
      return await this.postsRepository.createPost(
        feedData,
        companyId,
        creatorId,
        file,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  public async updatePost(
    postId: string,
    imageURL: string,
    input: UpdatePostInput,
    file: FileUpload,
    creatorId: string,
  ): Promise<UpdatePostPayload> {
    try {
      const post = await this.postsRepository.findPostByCreatorId(
        creatorId,
        postId,
      );
      if (!post) {
        throw new ApolloError(POST_MESSAGE.NOT_FOUND, POST_CODE.NOT_FOUND, {
          statusCode: STATUS_CODE.NOT_FOUND,
        });
      }
      return await this.postsRepository.updatePost(
        postId,
        imageURL,
        input,
        file,
        post,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  public async deletePost(
    postId: string,
    userId: string,
  ): Promise<DeletePostPayload> {
    try {
      const post = await this.postsRepository.findPostByCreatorId(
        userId,
        postId,
      );
      if (!post)
        throw new ApolloError(POST_MESSAGE.NOT_FOUND, POST_CODE.NOT_FOUND, {
          statusCode: STATUS_CODE.NOT_FOUND,
        });
      await this.postsRepository.deletePostById(post.id);
      return {
        isDeleteSuccessful: true,
      };
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
  public async findPostsByCompanyId(id: string, paginate: ConnectionArgs) {
    return this.postsRepository.findPostsByCompanyId(id, paginate);
  }
  public async findPostImage(id: string): Promise<PostImage[]> {
    return this.postsRepository.findPostImage(id);
  }
  public async findTags(id: string): Promise<Tag[]> {
    return this.postsRepository.findTags(id);
  }
  public async findCompanyPostsFollowedByUser(
    id: string,
    paginate: ConnectionArgs,
    order: OrderPosts,
  ) {
    return this.postsRepository.findCompanyPostsFollowedByUser(
      id,
      paginate,
      order,
    );
  }
  public async findCompanyPostImageFollowedByUser(
    id: string,
  ): Promise<PostImage[]> {
    return this.postsRepository.findCompanyPostImageFollowedByUser(id);
  }
  public async findCompanyPostTagsFollowedByUser(id: string): Promise<Tag[]> {
    return this.postsRepository.findCompanyPostTagsFollowedByUser(id);
  }
  public async getUserPosts(id: string): Promise<Post[]> {
    // return this.postsRepository.findPostsByUserId(id);
    return;
  }

  public async getPosts(): Promise<Post[]> {
    return;
    // return this.postsRepository.findPosts();
  }

  // public async createPost(input, creatorId): Promise<any> {
  //   return;
  // }
}
