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

@Injectable()
export class ReactionService {
  constructor(
    private readonly communityPostsRepository: CommunityPostRepository,
    private readonly reactionRepository: ReactionRepository,
  ) {}

  async getLikes(
    postId: string,
    paginate: PaginationArgs,
    order: CommunityPostReactionsOrderList,
  ) {
    /**find post by postId */
    const post = await this.communityPostsRepository.findPostById(postId);
    /**check if post exists or not */
    if (!post)
      return customError(
        POST_MESSAGE.NOT_FOUND,
        POST_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    return await this.reactionRepository.getLikes(postId, paginate, order);
  }

  async create(data: ReactionInput, userId: string): Promise<ReactionPayload> {
    /**find post by postId */
    const post = await this.communityPostsRepository.findPostById(data.postId);
    /**check if post exists or not */
    if (!post)
      return customError(
        POST_MESSAGE.NOT_FOUND,
        POST_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    return await this.reactionRepository.create(data, userId);
  }
}
