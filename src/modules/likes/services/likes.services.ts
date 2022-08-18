import { LikesInput } from './../dto/likes.inputs';
import { Injectable } from '@nestjs/common';
import { Likes } from '../likes.model';
import { PostsRepository } from 'src/modules/post/repository/post.repository';
import { LikesRepository } from '../repository/likes.repository';
import { LikesPayload } from '../entities/likes.payload';
import { Reactions } from '../entities/reactions.entity';

@Injectable()
export class LikesService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly likesRepository: LikesRepository,
  ) {}

  async getReactions(): Promise<Reactions[]> {
    return this.likesRepository.getReactions();
  }

  async getLikes(postId: string): Promise<LikesPayload> {
    const post = await this.postsRepository.findPostById(postId);
    if (!post) throw new Error('post not found');
    return await this.likesRepository.getLikes(postId);
  }
  async getUsersByPostReaction(reactionId: string): Promise<LikesPayload> {
    return await this.likesRepository.getUsersByPostReaction(reactionId);
  }

  async create(data: LikesInput, userId: string): Promise<Likes> {
    const post = await this.postsRepository.findPostById(data.postId);
    if (!post) throw new Error('Post not found');
    return await this.likesRepository.create(data, userId);
  }
  async disLike(postId: string, userId: string): Promise<Likes> {
    const post = await this.postsRepository.findPostById(postId);
    if (!post) throw new Error('Post not found');
    return await this.likesRepository.disLike(postId, userId);
  }
}
