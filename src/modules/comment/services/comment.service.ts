import { Injectable } from '@nestjs/common';
import { customError } from 'src/common/errors';
import { COMMENT_CODE, POST_CODE } from 'src/common/errors/error.code';
import { COMMENT_MESSAGE, POST_MESSAGE } from 'src/common/errors/error.message';
import { STATUS_CODE } from 'src/common/errors/error.statusCode';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { CommentsRepository } from '../repository/comment.repository';
import { PostsRepository } from 'src/modules/post/repository/post.repository';
import {
  PostCommentInput,
  PostMentionsInput,
  OrderCommentsList,
} from '../dto/create-comment.input';
import {
  PostDeleteCommentPayload,
  PostFirstLevelCommentPayload,
  GetPostFirstLevelCommentPayload,
  PostSecondLevelCommentPayload,
} from '../entities/comment.payload';

@Injectable()
export class CommentsService {
  public constructor(
    private readonly commentRepository: CommentsRepository,
    private readonly postRepository: PostsRepository,
  ) {}

  public async createFirstLevelComment(
    postId: string,
    creatorId: string,
    input: PostCommentInput,
    mention: PostMentionsInput,
  ): Promise<PostFirstLevelCommentPayload> {
    const { content } = input;
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
      content,
      mention,
    );
  }
  async updateComment(
    commentId: string,
    input: PostCommentInput,
    mention: PostMentionsInput,
    userId: string,
  ): Promise<PostFirstLevelCommentPayload> {
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
  ): Promise<PostDeleteCommentPayload> {
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
    order: OrderCommentsList,
  ): Promise<GetPostFirstLevelCommentPayload> {
    /*check if the post exists */
    const post = await this.postRepository.findPostById(postId);
    if (!post)
      return customError(
        POST_MESSAGE.NOT_FOUND,
        POST_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    const data = await this.commentRepository.getComments(
      postId,
      paginate,
      order,
    );
    return { data };
  }

  public async secondLevelComment(
    commentId: string,
    creatorId: string,
    input: PostCommentInput,
    mention: PostMentionsInput,
  ): Promise<PostSecondLevelCommentPayload> {
    const { content } = input;
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
      content,
      mention,
    );
  }
  // async createThirdLevelComment(
  //   commentId: string,
  //   input: PostCommentInput,
  //   userId: string,
  //   mention: PostMentionsInput,
  // ): Promise<ThirdLevelCommentPayload> {
  //   const comment = await this.commentRepository.findCommentById(commentId);
  //   if (!comment)
  //     return customError(
  //       COMMENT_MESSAGE.NOT_FOUND,
  //       COMMENT_CODE.NOT_FOUND,
  //       STATUS_CODE.NOT_FOUND,
  //     );
  //   return await this.commentRepository.createThirdLevelComment(
  //     commentId,
  //     input.text,
  //     userId,
  //     mention,
  //   );
  // }
  public async getSecondLevelComment(
    id: string,
    paginate: ConnectionArgs,
    order: OrderCommentsList,
  ) {
    const data = await this.commentRepository.getSecondLevelComment(
      id,
      paginate,
      order,
    );
    return { data };
  }
}
