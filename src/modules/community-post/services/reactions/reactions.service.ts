import { Injectable } from '@nestjs/common';
import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';
import { CommunityPostRepository } from '../../repository/post/community-post.repository';
import {
  CommunityPostReactionsOrderList,
  ReactionInput,
} from '../../dto/reactions/reaction.input';
import { ReactionRepository } from '../../repository/reactions/reactions.repository';
import { ReactionPayload } from '../../entities/reactions/reaction.payload';
import { customError } from 'src/common/errors';
import {
  COMMUNITY_MESSAGE,
  POST_MESSAGE,
} from 'src/common/errors/error.message';
import { POST_CODE } from 'src/common/errors/error.code';
import { STATUS_CODE } from 'src/common/errors/error.statusCode';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { ReactionsType } from '@prisma/client';
import { ApolloError } from 'apollo-server-express';

@Injectable()
export class ReactionService {
  constructor(
    private readonly communityPostsRepository: CommunityPostRepository,
    private readonly reactionRepository: ReactionRepository,
  ) {}

  async getLikes(
    postId: string,
    paginate: ConnectionArgs,
    order: CommunityPostReactionsOrderList,
  ) {
    try {
      /**find post by postId */
      const post = await this.communityPostsRepository.findPostById(postId);
      /**check if post exists or not */
      if (!post)
        throw new ApolloError(POST_MESSAGE.NOT_FOUND, POST_CODE.NOT_FOUND, {
          statusCode: STATUS_CODE.NOT_FOUND,
        });
      return await this.reactionRepository.getLikes(postId, paginate, order);
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
  async getLikesByType(
    postId: string,
    reactionType: ReactionsType,
    paginate: ConnectionArgs,
    order: CommunityPostReactionsOrderList,
  ) {
    try {
      /**find post by postId */
      const post = await this.communityPostsRepository.findPostById(postId);
      /**check if post exists or not */
      if (!post)
        throw new ApolloError(POST_MESSAGE.NOT_FOUND, POST_CODE.NOT_FOUND, {
          statusCode: STATUS_CODE.NOT_FOUND,
        });
      return await this.reactionRepository.getLikesByType(
        postId,
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

  async create(data: ReactionInput, userId: string): Promise<ReactionPayload> {
    try {
      /**find post by postId */
      const post = await this.communityPostsRepository.findPostById(
        data.postId,
      );
      /**check if post exists or not */
      if (!post)
        throw new ApolloError(POST_MESSAGE.NOT_FOUND, POST_CODE.NOT_FOUND, {
          statusCode: STATUS_CODE.NOT_FOUND,
        });
      return await this.reactionRepository.create(data, userId);
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
}
