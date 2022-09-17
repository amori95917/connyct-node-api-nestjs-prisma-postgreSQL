import {
  CreateMentionsInput,
  OrderCommentsList,
} from './../dto/create-comment.input';
import { Injectable } from '@nestjs/common';

import { CommentsRepository } from '../repository/comment.repository';

import type { Comment } from '../comment.models';
import type { CreateCommentInput } from '../dto/create-comment.input';
import type { NewReplyPayload } from '../entities/new-reply.payload';
import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';
import { PostsRepository } from 'src/modules/post/repository/post.repository';
import { POST_CODE } from 'src/common/errors/error.code';
import { STATUS_CODE } from 'src/common/errors/error.statusCode';
import { POST_MESSAGE } from 'src/common/errors/error.message';
import { User } from 'src/modules/user/entities/user.entity';
import { ReplyToCommentPayload } from 'src/modules/replies/entities/reply-to-comment.payload';
import { customError } from 'src/common/errors';

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
    mention: CreateMentionsInput,
  ): Promise<NewReplyPayload> {
    const { text } = input;
    const post = await this.postsRepository.findPostById(postId);
    if (!post)
      return customError(
        POST_MESSAGE.NOT_FOUND,
        POST_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    return await this.commentsRepository.createCommentToPost(
      creatorId,
      postId,
      text,
      mention,
    );
  }

  public async replyToComment(
    commentId: string,
    creatorId: string,
    input: CreateCommentInput,
    mention: CreateMentionsInput,
  ): Promise<ReplyToCommentPayload> {
    const { text } = input;
    return await this.commentsRepository.createCommentToComment(
      creatorId,
      commentId,
      text,
      mention,
    );
  }
  async createReplyToReply(
    commentId: string,
    input: CreateCommentInput,
    userId: string,
    mention: CreateMentionsInput,
  ) {
    return await this.commentsRepository.createReplyToReply(
      commentId,
      input.text,
      userId,
      mention,
    );
  }

  async getMentionsUser(id: string): Promise<User[]> {
    return this.commentsRepository.getMentionsUser(id);
  }
  public async getCommentsByPostId(postId: string): Promise<Comment[]> {
    return this.commentsRepository.findCommentsByPostId(postId);
  }

  public async getComments(
    postId: string,
    paginate: PaginationArgs,
    order: OrderCommentsList,
  ) {
    /*check if the post exists */
    const post = await this.postsRepository.findPostById(postId);
    if (!post)
      return customError(
        POST_MESSAGE.NOT_FOUND,
        POST_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    const comments = await this.commentsRepository.getComments(
      postId,
      paginate,
      order,
    );
    return { comments };
  }
  public async getRepliesToComment(
    id: string,
    paginate: PaginationArgs,
    order: OrderCommentsList,
  ) {
    return this.commentsRepository.findRepliesToComment(id, paginate, order);
  }
}
