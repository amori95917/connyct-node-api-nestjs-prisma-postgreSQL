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
import { ApolloError } from 'apollo-server-express';

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
    try {
      const { text } = input;
      const post = await this.postRepository.findPostById(postId);
      if (!post)
        throw new ApolloError(POST_MESSAGE.NOT_FOUND, POST_CODE.NOT_FOUND, {
          statusCode: STATUS_CODE.NOT_FOUND,
        });
      return await this.commentRepository.createFirstLevelComment(
        postId,
        creatorId,
        text,
        mention,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
  async updateComment(
    commentId: string,
    input: CommentInput,
    mention: MentionsInput,
    userId: string,
  ): Promise<FirstLevelCommentPayload> {
    try {
      const comment = await this.commentRepository.findCommentByIdAndUserId(
        commentId,
        userId,
      );
      if (!comment)
        throw new ApolloError(
          COMMENT_MESSAGE.NOT_FOUND,
          COMMENT_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      return await this.commentRepository.updateComment(
        commentId,
        input,
        mention,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
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
        throw new ApolloError(
          COMMENT_MESSAGE.NOT_FOUND,
          COMMENT_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      return await this.commentRepository.deleteComment(commentId);
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  public async getComments(
    postId: string,
    paginate: ConnectionArgs,
    order: OrderCommentList,
  ): Promise<FirstLevelCommentPaginatedPayload> {
    try {
      /*check if the post exists */
      const post = await this.postRepository.findPostById(postId);
      if (!post)
        throw new ApolloError(POST_MESSAGE.NOT_FOUND, POST_CODE.NOT_FOUND, {
          statusCode: STATUS_CODE.NOT_FOUND,
        });
      const comment = await this.commentRepository.getComments(
        postId,
        paginate,
        order,
      );
      return { comment };
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  public async secondLevelComment(
    commentId: string,
    creatorId: string,
    input: CommentInput,
    mention: MentionsInput,
  ): Promise<SecondLevelCommentPayload> {
    try {
      const { text } = input;
      const comment = await this.commentRepository.findCommentById(commentId);
      if (!comment)
        throw new ApolloError(
          COMMENT_MESSAGE.NOT_FOUND,
          COMMENT_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      return await this.commentRepository.createSecondLevelComment(
        creatorId,
        commentId,
        text,
        mention,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
  async createThirdLevelComment(
    commentId: string,
    input: CommentInput,
    userId: string,
    mention: MentionsInput,
  ): Promise<ThirdLevelCommentPayload> {
    try {
      const comment = await this.commentRepository.findCommentById(commentId);
      if (!comment)
        throw new ApolloError(
          COMMENT_MESSAGE.NOT_FOUND,
          COMMENT_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      return await this.commentRepository.createThirdLevelComment(
        commentId,
        input.text,
        userId,
        mention,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
  public async getSecondLevelComment(
    id: string,
    paginate: ConnectionArgs,
    order: OrderCommentList,
  ) {
    const comment = await this.commentRepository.getSecondLevelComment(
      id,
      paginate,
      order,
    );
    return { comment };
  }
}
