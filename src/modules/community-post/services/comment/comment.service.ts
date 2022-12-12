import { Injectable } from '@nestjs/common';
import { customError } from 'src/common/errors';
import { COMMENT_CODE, POST_CODE } from 'src/common/errors/error.code';
import { COMMENT_MESSAGE, POST_MESSAGE } from 'src/common/errors/error.message';
import { STATUS_CODE } from 'src/common/errors/error.statusCode';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import {
  CommentInput,
  MentionsInput,
  OrderCommentList,
} from '../../dto/comment/comment.input';
import { FirstLevelCommentPaginatedPayload } from '../../entities/comment/comment-pagination.payload';
import {
  FirstLevelCommentPayload,
  SecondLevelCommentPayload,
  ThirdLevelCommentPayload,
} from '../../entities/comment/createComment.payload';
import { DeleteCommentPayload } from '../../entities/comment/delete-comment.payload';
import { CommentRepository } from '../../repository/comment/comment.repository';
import { CommunityPostRepository } from '../../repository/post/community-post.repository';

@Injectable()
export class CommentService {
  public constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: CommunityPostRepository,
  ) {}

  public async createFirstLevelComment(
    postId: string,
    creatorId: string,
    input: CommentInput,
    mention: MentionsInput,
  ): Promise<FirstLevelCommentPayload> {
    const { text } = input;
    const post = await this.postRepository.findPostById(postId);
    if (!post)
      return customError(
        POST_MESSAGE.NOT_FOUND,
        POST_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    return await this.commentRepository.createFirstLevelComment(
      postId,
      creatorId,
      text,
      mention,
    );
  }
  async updateComment(
    commentId: string,
    input: CommentInput,
    mention: MentionsInput,
    userId: string,
  ): Promise<FirstLevelCommentPayload> {
    const comment = await this.commentRepository.findCommentByIdAndUserId(
      commentId,
      userId,
    );
    if (!comment)
      return customError(
        COMMENT_MESSAGE.NOT_FOUND,
        COMMENT_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    return await this.commentRepository.updateComment(
      commentId,
      input,
      mention,
    );
  }

  async deleteComment(
    commentId: string,
    userId: string,
  ): Promise<DeleteCommentPayload> {
    try {
      const comment = await this.commentRepository.findCommentByIdAndUserId(
        commentId,
        userId,
      );
      if (!comment)
        return customError(
          COMMENT_MESSAGE.NOT_FOUND,
          COMMENT_CODE.NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );
      return await this.commentRepository.deleteComment(commentId);
    } catch (err) {
      throw new Error(err);
    }
  }

  public async getComments(
    postId: string,
    paginate: ConnectionArgs,
    order: OrderCommentList,
  ): Promise<FirstLevelCommentPaginatedPayload> {
    /*check if the post exists */
    const post = await this.postRepository.findPostById(postId);
    if (!post)
      return customError(
        POST_MESSAGE.NOT_FOUND,
        POST_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    const comment = await this.commentRepository.getComments(
      postId,
      paginate,
      order,
    );
    return { comment };
  }

  public async secondLevelComment(
    commentId: string,
    creatorId: string,
    input: CommentInput,
    mention: MentionsInput,
  ): Promise<SecondLevelCommentPayload> {
    const { text } = input;
    const comment = await this.commentRepository.findCommentById(commentId);
    if (!comment)
      return customError(
        COMMENT_MESSAGE.NOT_FOUND,
        COMMENT_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    return await this.commentRepository.createSecondLevelComment(
      creatorId,
      commentId,
      text,
      mention,
    );
  }
  async createThirdLevelComment(
    commentId: string,
    input: CommentInput,
    userId: string,
    mention: MentionsInput,
  ): Promise<ThirdLevelCommentPayload> {
    const comment = await this.commentRepository.findCommentById(commentId);
    if (!comment)
      return customError(
        COMMENT_MESSAGE.NOT_FOUND,
        COMMENT_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    return await this.commentRepository.createThirdLevelComment(
      commentId,
      input.text,
      userId,
      mention,
    );
  }
  public async getSecondLevelComment(
    id: string,
    paginate: ConnectionArgs,
    order: OrderCommentList,
  ) {
    return this.commentRepository.getSecondLevelComment(id, paginate, order);
  }
}
