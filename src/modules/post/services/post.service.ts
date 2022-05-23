import { Injectable, NotFoundException } from '@nestjs/common';

import { PostsRepository } from '../repository/post.repository';

import type { CreatePostInput } from '../dto/create-post.input';
import type { CreatePostPayload } from '../entities/create-post.payload';
import type { DeletePostPayload } from '../entities/delete-post.payload';
import type { UpdatePostInput } from '../dto/update-post.input';
import type { UpdatePostPayload } from '../entities/update-post.payload';
import type { Post } from '../post.models';

@Injectable()
export class PostsService {
  public constructor(private readonly postsRepository: PostsRepository) {}

  public async getPostById(id: string): Promise<Post> {
    const post = await this.postsRepository.findPostById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  public async createPost(
    input: CreatePostInput,
    creatorId: string,
  ): Promise<CreatePostPayload> {
    const post = await this.postsRepository.createPost(input, creatorId);
    return {
      post,
    };
  }

  public async updatePost(
    postId: string,
    input: UpdatePostInput,
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
    const updatedPost = await this.postsRepository.updatePost(postId, input, {
      tags: Boolean('tags'),
    });
    return {
      post: updatedPost,
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

  public async getUserPosts(id: string): Promise<Post[]> {
    return this.postsRepository.findPostsByUserId(id);
  }

  public async getPosts(): Promise<Post[]> {
    return this.postsRepository.findPosts();
  }
}
