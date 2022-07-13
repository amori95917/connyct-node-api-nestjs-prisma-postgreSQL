import { Injectable, NotFoundException } from '@nestjs/common';

import { PostsRepository } from '../repository/post.repository';

import type { CreatePostInput } from '../dto/create-post.input';
import type { CreatePostPayload } from '../entities/create-post.payload';
import type { DeletePostPayload } from '../entities/delete-post.payload';
import type { UpdatePostPayload } from '../entities/update-post.payload';
import type { Post } from '../post.models';
import { FileUpload } from 'graphql-upload';
import { Product } from '../entities/product.entity';
import { Tag } from '../entities/tags.entity';

@Injectable()
export class PostsService {
  public constructor(private readonly postsRepository: PostsRepository) {}

  public async getPostById(id: string): Promise<Post> {
    const post = await this.postsRepository.findPostById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return;
    // return post;
  }

  public async createPost(
    feedData: CreatePostInput,
    file: FileUpload[],
    creatorId: string,
  ): Promise<CreatePostPayload> {
    const result = await this.postsRepository.createPost(
      feedData,
      creatorId,
      file,
    );
    return {
      post: result.post,
      tags: result.tags,
      product: result.product,
    };
  }

  public async updatePost(
    postId: string,
    productId: string,
    input: CreatePostInput,
    file: FileUpload,
    creatorId: string,
  ): Promise<UpdatePostPayload> {
    const post = await this.postsRepository.findPostByCreatorId(
      creatorId,
      postId,
    );
    if (!post) {
      return {
        errors: [
          {
            message: 'Post does not exist or you are not the author',
          },
        ],
      };
    }
    const updatedResult = await this.postsRepository.updatePost(
      postId,
      productId,
      input,
      file,
    );
    return {
      post: updatedResult.post,
      product: updatedResult.product,
      tags: updatedResult.tags,
    };
  }

  public async deletePost(
    postId: string,
    userId: string,
  ): Promise<DeletePostPayload> {
    const post = await this.postsRepository.findPostByCreatorId(userId, postId);
    if (!post) {
      return {
        errors: [
          {
            message: 'Post does not exist or you are not the author',
          },
        ],
        isDeleteSuccessful: false,
      };
    }
    await this.postsRepository.deletePostById(post.id);
    return {
      isDeleteSuccessful: true,
    };
  }
  public async findPostsByCompanyId(id: string): Promise<Post[]> {
    return this.postsRepository.findPostsByCompanyId(id);
  }
  public async findProducts(id: string): Promise<Product[]> {
    return this.postsRepository.findProducts(id);
  }
  public async findTags(id: string): Promise<Tag[]> {
    return this.postsRepository.findTags(id);
  }
  public async findCompanyPostsFollowedByUser(
    id: string,
  ): Promise<Post[] | null> {
    return this.postsRepository.findCompanyPostsFollowedByUser(id);
  }
  public async findCompanyPostProductsFollowedByUser(
    id: string,
  ): Promise<Product[]> {
    return this.postsRepository.findCompanyPostProductsFollowedByUser(id);
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
