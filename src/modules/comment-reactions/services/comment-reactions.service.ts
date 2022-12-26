import {
  CommentReactionsInput,
  CommentReactionsOrderList,
} from './../dto/comment-reactions.input';
import { Injectable } from '@nestjs/common';
import { CommentReactionsPayload } from '../entities/comment-reaction.payload';
import { CommentReactionsRepository } from '../repository/comment-reactions.repository';
import { CommentsRepository } from 'src/modules/comment/repository/comment.repository';
import { customError } from 'src/common/errors';
import { COMMENT_MESSAGE } from 'src/common/errors/error.message';
import { COMMENT_CODE } from 'src/common/errors/error.code';
import { STATUS_CODE } from 'src/common/errors/error.statusCode';
import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';

@Injectable()
export class CommentReactionsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly commentReactionsRepository: CommentReactionsRepository,
  ) {}

  async getComments(
    commentId: string,
    paginate: PaginationArgs,
    order: CommentReactionsOrderList,
  ) {
    try {
      const comment = await this.commentsRepository.findCommentById(commentId);
      if (!comment)
        return customError(
          COMMENT_MESSAGE.NOT_FOUND,
          COMMENT_CODE.NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );
      return this.commentReactionsRepository.getComments(
        commentId,
        paginate,
        order,
      );
    } catch (err) {
      throw new Error(err);
    }
  }

  async create(
    input: CommentReactionsInput,
    creatorId: string,
  ): Promise<CommentReactionsPayload> {
    try {
      /**check if comment exists  or not*/
      if (!(await this.commentsRepository.findCommentById(input.commentId)))
        return customError(
          COMMENT_MESSAGE.NOT_FOUND,
          COMMENT_CODE.NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );
      return this.commentReactionsRepository.create(input, creatorId);
    } catch (err) {
      throw new Error(err);
    }
  }
}
