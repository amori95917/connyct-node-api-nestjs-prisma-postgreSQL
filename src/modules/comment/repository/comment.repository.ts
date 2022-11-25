import {
  CreateCommentInput,
  CreateMentionsInput,
  OrderCommentsList,
} from './../dto/create-comment.input';
import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';
import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/modules/prisma/prisma.service';
import type { Comment } from '@prisma/client';
import { haveNextPage } from 'src/modules/prisma/resolvers/pagination/pagination';
import {
  CommentDeletePayload,
  NewReplyPayload,
} from '../entities/new-reply.payload';
import { COMMENT_MESSAGE } from 'src/common/errors/error.message';
import { COMMENT_CODE } from 'src/common/errors/error.code';
import { STATUS_CODE } from 'src/common/errors/error.statusCode';
import { UserService } from 'src/modules/user/services/user.service';
import { User } from 'src/modules/user/entities/user.entity';
import { ReplyToCommentPayload } from 'src/modules/replies/entities/reply-to-comment.payload';
import { customError } from 'src/common/errors';
import { RepliesToRepliesPayload } from 'src/modules/replies/entities/reply-to-reply.payload';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { findManyCursorConnection } from 'src/modules/prisma/resolvers/pagination/relay.pagination';
@Injectable()
export class CommentsRepository {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  public async findCommentById(id: string): Promise<Comment> {
    return await this.prisma.comment.findFirst({
      where: { id: id },
    });
  }

  async findCOmmentByIdAndUserId(id: string, creatorId: string) {
    return await this.prisma.comment.findFirst({ where: { id, creatorId } });
  }

  public async mentions(mentions, commentId: string) {
    const commentMention = mentions.mentionIds.map((userId) => {
      return Object.assign({}, { mentionId: userId }, { commentId: commentId });
    });
    const user = await this.userService.findUsersByIds(mentions.mentionIds);
    if (user.length) {
      await this.prisma.commentMentions.createMany({
        data: commentMention,
      });
    }
    return user;
  }

  public async updateMentions(mentions: string[], commentId: string) {
    const commentMention = mentions.map((userId: string) => {
      return Object.assign({}, { mentionId: userId }, { commentId });
    });
    const user = await this.userService.findUsersByIds(mentions);
    if (user.length) {
      await this.prisma.commentMentions.deleteMany({
        where: { commentId },
      });

      await this.prisma.commentMentions.createMany({
        data: commentMention,
      });
    }
    return user;
  }

  public async createCommentToPost(
    creatorId: string,
    postId: string,
    text: string,
    mentions: CreateMentionsInput,
  ): Promise<NewReplyPayload> {
    try {
      const comment = await this.prisma.$transaction(async () => {
        const create = await this.prisma.comment.create({
          data: {
            creatorId,
            postId,
            text,
          },
        });
        if (!mentions.mentionIds) return { create, user: null };
        const user = await this.mentions(mentions, create.id);
        return { create, user };
      });
      return {
        comment: Object.assign(comment.create, { mentions: comment.user }),
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  public async createCommentToComment(
    creatorId: string,
    commentId: string,
    text: string,
    mention: CreateMentionsInput,
  ): Promise<ReplyToCommentPayload> {
    const comment = await this.findCommentById(commentId);
    if (!comment)
      return customError(
        COMMENT_MESSAGE.NOT_FOUND,
        COMMENT_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    const createReply = await this.prisma.$transaction(async () => {
      const create = await this.prisma.comment.create({
        data: {
          creatorId,
          postId: comment.postId,
          repliedToCommentId: commentId,
          text,
        },
      });
      if (!mention.mentionIds) return { create, user: null };
      const user = await this.mentions(mention, create.id);
      return { create, user };
    });

    return {
      replies: Object.assign(createReply.create, {
        mentions: createReply.user,
      }),
    };
  }
  public async createReplyToReply(
    commentId: string,
    text: string,
    creatorId: string,
    mention: CreateMentionsInput,
  ): Promise<RepliesToRepliesPayload> {
    try {
      const comment = await this.prisma.comment.findFirst({
        where: { id: commentId },
      });
      /**check if comment exists or not */
      if (!comment)
        return customError(
          COMMENT_MESSAGE.NOT_FOUND,
          COMMENT_CODE.NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );
      const createReply = await this.prisma.$transaction(async () => {
        const create = await this.prisma.comment.create({
          data: {
            text,
            creatorId,
            repliedToReplyId: commentId,
            postId: comment.postId,
          },
        });

        if (!mention.mentionIds) return { create, user: null };
        const user = await this.mentions(mention, create.id);
        return { create, user };
      });

      return {
        replies: Object.assign(createReply.create, {
          mentions: createReply.user,
        }),
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateComment(
    commentId: string,
    input: CreateCommentInput,
    mention: CreateMentionsInput,
  ): Promise<NewReplyPayload> {
    try {
      const updateReply = await this.prisma.$transaction(async () => {
        const update = await this.prisma.comment.update({
          where: { id: commentId },
          data: {
            text: input.text,
          },
        });

        if (!mention.mentionIds) return { update, user: null };
        const user = await this.updateMentions(mention.mentionIds, commentId);
        return { update, user };
      });

      return {
        comment: Object.assign(updateReply.update, {
          mentions: updateReply.user,
        }),
      };
    } catch (err) {
      throw new Error(err);
    }
  }
  async deleteComment(id: string): Promise<CommentDeletePayload> {
    try {
      await this.prisma.$transaction(async () => {
        await this.prisma.comment.delete({ where: { id } });
        await this.prisma.commentMentions.deleteMany({
          where: { commentId: id },
        });
      });
      return { isDeleted: true };
    } catch (err) {
      throw new Error(err);
    }
  }

  async getMentionsUser(id: string): Promise<User[]> {
    try {
      const mentions = await this.prisma.commentMentions.findMany({
        where: { commentId: id },
        include: { user: true },
      });
      return mentions.map((mention) => mention.user);
    } catch (err) {
      throw new Error(err);
    }
  }
  public async findCommentsByPostId(postId: string): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: {
        postId,
      },
    });
  }

  public async findCommentsByIds(keys: readonly string[]): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: {
        id: {
          in: [...keys],
        },
      },
    });
  }

  public async incrementRatingById(
    commentId: string,
    incrementRating: number,
  ): Promise<void> {
    await this.prisma.comment.update({
      data: {
        rating: {
          increment: incrementRating,
        },
      },
      where: {
        id: commentId,
      },
    });
  }
  public async getComments(
    postId: string,
    paginate: ConnectionArgs,
    order: OrderCommentsList,
  ) {
    try {
      const baseArgs = {
        where: { postId, repliedToCommentId: null, repliedToReplyId: null },
        orderBy: { [order.orderBy]: order.direction },
      };
      const result = await findManyCursorConnection(
        (args) => this.prisma.comment.findMany({ ...args, ...baseArgs }),
        () => this.prisma.comment.count({ where: baseArgs.where }),
        { ...paginate },
      );
      return result;
      /* get comments*/
      // const nodes = await this.prisma.comment.findMany({
      //   where: { postId, repliedToCommentId: null, repliedToReplyId: null },
      //   skip: paginate.skip,
      //   take: paginate.take,
      //   orderBy: { [order.orderBy]: order.direction },
      // });
      // const totalCount = await this.prisma.comment.count({
      //   where: { postId, repliedToCommentId: null, repliedToReplyId: null },
      // });
      // const hasNextPage = haveNextPage(
      //   paginate.skip,
      //   paginate.take,
      //   totalCount,
      // );
      // return {
      //   nodes,
      //   totalCount,
      //   hasNextPage,
      //   edges: nodes?.map((node) => ({
      //     node,
      //     cursor: Buffer.from(node.id).toString('base64'),
      //   })),
      // };
    } catch (err) {
      throw new Error(err);
    }
  }
  public async findRepliesToComment(
    id: string,
    paginate: ConnectionArgs,
    order: OrderCommentsList,
  ) {
    /**get reply according to repliedToCommentId or repliedToReplyId */
    const baseArgs = {
      where: { OR: [{ repliedToCommentId: id }, { repliedToReplyId: id }] },
      orderBy: { [order.orderBy]: order.direction },
    };
    const replies = await findManyCursorConnection(
      (args) => this.prisma.comment.findMany({ ...args, ...baseArgs }),
      () => this.prisma.comment.count({ where: baseArgs.where }),
      { ...paginate },
    );
    return replies;
    // const replies = await this.prisma.comment.findMany({
    //   where: {
    //     OR: [{ repliedToCommentId: id }, { repliedToReplyId: id }],
    //   },
    //   take: paginate.take,
    //   skip: paginate.skip,
    //   orderBy: { [order.orderBy]: order.direction },
    // });
    // const totalCount = await this.prisma.comment.count({
    //   where: { OR: [{ repliedToCommentId: id }, { repliedToReplyId: id }] },
    // });
    // const hasNextPage = haveNextPage(paginate.skip, paginate.take, totalCount);
    // return {
    //   nodes: replies,
    //   totalCount,
    //   hasNextPage,
    //   edges: replies?.map((node) => ({
    //     node,
    //     cursor: Buffer.from(node.id).toString('base64'),
    //   })),
    // };
  }
}
