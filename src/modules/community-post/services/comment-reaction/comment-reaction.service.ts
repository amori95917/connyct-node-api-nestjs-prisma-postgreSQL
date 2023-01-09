import { CommentRepository } from 'src/modules/community-post/repository/comment/comment.repository';
import { Injectable } from '@nestjs/common';
import { CommunityPostCommentReactionRepository } from '../../repository/comment-reaction/comment-reaction.repository';
import {
  CommunityPostCommentReactionInput,
  CommunityPostCommentReactionsOrderList,
} from '../../dto/comment-reaction/comment-reaction.dto';
import { CommunityPostCommentReactionPayload } from '../../entities/comment-reaction/comment-reaction.payload';
import { ReactionsType } from '@prisma/client';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { COMMENT_MESSAGE } from 'src/common/errors/error.message';
import { COMMENT_CODE } from 'src/common/errors/error.code';
import { STATUS_CODE } from 'src/common/errors/error.statusCode';
import { customError } from 'src/common/errors';
import { ApolloError } from 'apollo-server-express';

@Injectable()
export class CommunityPostCommentReactionService {
  constructor(
    private readonly communityPostCommentReactionRepository: CommunityPostCommentReactionRepository,
    private readonly communityPostCommentRepository: CommentRepository,
  ) {}
  async getReactions(
    communityPostCommentId: string,
    paginate: ConnectionArgs,
    order: CommunityPostCommentReactionsOrderList,
  ) {
    try {
      /**find comment by id  */
      const comment = await this.communityPostCommentRepository.findCommentById(
        communityPostCommentId,
      );
      if (!comment)
        throw new ApolloError(
          COMMENT_MESSAGE.NOT_FOUND,
          COMMENT_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      return await this.communityPostCommentReactionRepository.getReactions(
        communityPostCommentId,
        paginate,
        order,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
  async getLikesByType(
    communityPostCommentId: string,
    reactionType: ReactionsType,
    paginate: ConnectionArgs,
    order: CommunityPostCommentReactionsOrderList,
  ) {
    try {
      /**find post by postId */
      const comment = await this.communityPostCommentRepository.findCommentById(
        communityPostCommentId,
      );
      /**check if post exists or not */
      if (!comment)
        throw new ApolloError(
          COMMENT_MESSAGE.NOT_FOUND,
          COMMENT_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      return await this.communityPostCommentReactionRepository.getLikesByType(
        communityPostCommentId,
        reactionType,
        paginate,
        order,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
  async create(
    input: CommunityPostCommentReactionInput,
    userId: string,
  ): Promise<CommunityPostCommentReactionPayload> {
    try {
      const comment = await this.communityPostCommentRepository.findCommentById(
        input.communityPostCommentId,
      );
      /**check if post exists or not */
      if (!comment)
        throw new ApolloError(
          COMMENT_MESSAGE.NOT_FOUND,
          COMMENT_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );

      return await this.communityPostCommentReactionRepository.create(
        input,
        userId,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
}
