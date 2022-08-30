import { LikesInput, ReactionsOrderList } from './../dto/likes.inputs';
import { Injectable } from '@nestjs/common';
import { Likes } from '../likes.model';
import { PostsRepository } from 'src/modules/post/repository/post.repository';
import { LikesRepository } from '../repository/likes.repository';
import { Reactions } from '../entities/reactions.entity';
import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';
import { LikesPayload } from '../entities/likes.payload';

@Injectable()
export class LikesService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly likesRepository: LikesRepository,
  ) {}

  async getReactions(): Promise<Reactions[]> {
    /**return reactions */
    return this.likesRepository.getReactions();
  }

  async getLikes(
    postId: string,
    paginate: PaginationArgs,
    order: ReactionsOrderList,
  ) {
    /**find post by postId */
    const post = await this.postsRepository.findPostById(postId);
    /**check if post exists or not */
    if (!post) throw new Error('post not found');
    return await this.likesRepository.getLikes(postId, paginate, order);
  }
  async getUsersByPostReaction(
    reactionType: string,
    paginate: PaginationArgs,
    order: ReactionsOrderList,
  ) {
    return await this.likesRepository.getUsersByPostReaction(
      reactionType,
      paginate,
      order,
    );
  }

  async create(data: LikesInput, userId: string): Promise<LikesPayload> {
    /**find post by postId */
    const post = await this.postsRepository.findPostById(data.postId);
    /**check if post exists or not */
    if (!post) throw new Error('Post not found');
    return await this.likesRepository.create(data, userId);
  }
  async removeLike(postId: string, userId: string): Promise<LikesPayload> {
    /**find post by postId */
    const post = await this.postsRepository.findPostById(postId);
    /**check if post exists or not */
    if (!post) throw new Error('Post not found');
    return await this.likesRepository.removeLike(postId, userId);
  }
}
