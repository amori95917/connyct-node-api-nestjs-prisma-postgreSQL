import { Injectable } from '@nestjs/common';
import { customError } from 'src/common/errors';
import { REACTION_CODE } from 'src/common/errors/error.code';
import { REACTION_MESSAGE } from 'src/common/errors/error.message';
import { STATUS_CODE } from 'src/common/errors/error.statusCode';
import { LikesRepository } from 'src/modules/likes/repository/likes.repository';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { haveNextPage } from 'src/modules/prisma/resolvers/pagination/pagination';
import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';
import {
  CommentReactionsInput,
  CommentReactionsOrderList,
} from '../dto/comment-reactions.input';
import { CommentReactionsPayload } from '../entities/comment-reaction.payload';

@Injectable()
export class CommentReactionsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly likesRepository: LikesRepository,
  ) {}

  public async getComments(
    commentId: string,
    paginate: PaginationArgs,
    order: CommentReactionsOrderList,
  ) {
    try {
      const nodes = await this.prisma.commentReactions.findMany({
        where: { commentId },
        skip: paginate.skip,
        take: paginate.take,
        orderBy: { [order.orderBy]: order.direction },
      });
      const totalCount = await this.prisma.commentReactions.count({
        where: { commentId },
      });
      const hasNextPage = haveNextPage(
        paginate.skip,
        paginate.take,
        totalCount,
      );
      return {
        reactions: {
          nodes,
          totalCount,
          hasNextPage,
          edges: nodes?.map((node) => ({
            node,
            cursor: Buffer.from(node.id).toString('base64'),
          })),
        },
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  public async removeReaction(
    commentId: string,
    creatorId: string,
  ): Promise<CommentReactionsPayload> {
    try {
      /**find reactions from postReactions who reacted(user) */
      const likes = await this.prisma.commentReactions.findFirst({
        where: { commentId, creatorId },
      });
      /**remove reaction */
      await this.prisma.commentReactions.delete({
        where: { id: likes.id },
      });
      return {
        isDisliked: true,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  public async create(
    input: CommentReactionsInput,
    creatorId: string,
  ): Promise<CommentReactionsPayload> {
    try {
      const checkCommentReaction = await this.prisma.commentReactions.findFirst(
        {
          where: { commentId: input.commentId, creatorId },
        },
      );
      /**check reaction exists or not*/
      const checkReaction = await this.likesRepository.findReactionsByType(
        input.reactionType,
      );
      if (!checkReaction)
        return customError(
          REACTION_MESSAGE.NOT_FOUND,
          REACTION_CODE.NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );
      if (!checkCommentReaction) {
        /**create likes(reactions) if doesnot exist*/
        const createReaction = await this.prisma.commentReactions.create({
          data: {
            commentId: input.commentId,
            reactionId: checkReaction.id,
            creatorId,
          },
        });
        return { commentReactions: createReaction };
      }
      /**if same reaction already exist, remove it*/
      if (
        !checkCommentReaction ||
        checkCommentReaction.reactionId === checkReaction.id
      )
        return await this.removeReaction(input.commentId, creatorId);
      /**update reaction if user changes the reactions */
      const updateReaction = await this.prisma.commentReactions.update({
        where: { id: checkCommentReaction.id },
        data: { ...checkCommentReaction, reactionId: checkReaction.id },
      });
      return {
        commentReactions: updateReaction,
      };
    } catch (err) {
      throw new Error(err);
    }
  }
}
