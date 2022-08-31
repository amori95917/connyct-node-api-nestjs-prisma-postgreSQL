import { OrderCommentsList } from './../dto/create-comment.input';
import { Injectable } from '@nestjs/common';

import { CommentsRepository } from '../repository/comment.repository';

import type { Comment } from '../comment.models';
import type { CreateCommentInput } from '../dto/create-comment.input';
import type { NewReplyPayload } from '../entities/new-reply.payload';
import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';
import { PostsRepository } from 'src/modules/post/repository/post.repository';

@Injectable()
export class CommentsService {
  public constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  public async replyToPost(
    postId: string,
    creatorId: string,
    input: CreateCommentInput,
  ): Promise<NewReplyPayload> {
    const { text } = input;
    const post = await this.postsRepository.findPostById(postId);
    if (!post) throw new Error(`post doesn't exist`);
    const comment = await this.commentsRepository.createCommentToPost(
      creatorId,
      postId,
      text,
    );
    return { comment };
  }

  public async replyToComment(
    commentId: string,
    postId: string,
    creatorId: string,
    input: CreateCommentInput,
  ): Promise<NewReplyPayload> {
    const { text } = input;
    const comment = await this.commentsRepository.createCommentToComment(
      creatorId,
      commentId,
      postId,
      text,
    );
    return { comment };
  }

  public async getCommentsByPostId(postId: string): Promise<Comment[]> {
    return this.commentsRepository.findCommentsByPostId(postId);
  }

  public async getRepliesToComment(id: string): Promise<Comment[]> {
    return this.commentsRepository.findRepliesToComment(id);
  }

  public async getComments(
    postId: string,
    paginate: PaginationArgs,
    order: OrderCommentsList,
  ) {
    return this.commentsRepository.getComments(postId, paginate, order);
  }
}
