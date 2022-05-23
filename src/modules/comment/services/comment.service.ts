import { Injectable } from '@nestjs/common';

import { CommentsRepository } from '../repository/comment.repository';

import type { Comment } from '../comment.models';
import type { CreateCommentInput } from '../dto/create-comment.input';
import type { NewReplyPayload } from '../entities/new-reply.payload';

@Injectable()
export class CommentsService {
  public constructor(private readonly commentsRepository: CommentsRepository) {}

  public async replyToPost(
    postId: string,
    creatorId: string,
    input: CreateCommentInput,
  ): Promise<NewReplyPayload> {
    const { text } = input;
    const comment = await this.commentsRepository.createCommentToPost(
      creatorId,
      postId,
      text,
    );
    return { comment };
  }

  public async replyToComment(
    commentId: string,
    creatorId: string,
    input: CreateCommentInput,
  ): Promise<NewReplyPayload> {
    const { text } = input;
    const comment = await this.commentsRepository.createCommentToComment(
      creatorId,
      commentId,
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
}
