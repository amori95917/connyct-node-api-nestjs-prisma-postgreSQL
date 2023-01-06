import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { findManyCursorConnection } from 'src/modules/prisma/resolvers/pagination/relay.pagination';
import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';
import {
  PostCommentInput,
  PostMentionsInput,
  OrderCommentsList,
} from '../dto/create-comment.input';
import {
  PostDeleteCommentPayload,
  PostFirstLevelCommentPayload,
  PostSecondLevelCommentPayload,
} from '../entities/comment.payload';

@Injectable()
export class CommentsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  public async getComments(
    postId: string,
    paginate: ConnectionArgs,
    order: OrderCommentsList,
  ) {
    try {
      const baseArgs = {
        where: {
          postId,
          commentId: null,
        },
        orderBy: { [order.orderBy]: order.direction },
      };
      const result = await findManyCursorConnection(
        (args) => this.prisma.comment.findMany({ ...args, ...baseArgs }),
        () => this.prisma.comment.count({ where: baseArgs.where }),
        { ...paginate },
      );
      return result;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getCommentCount(postId: string) {
    return await this.prisma.comment.count({
      where: {
        postId,
      },
    });
  }

  async getRepliesCount(commentId: string) {
    return await this.prisma.comment.count({
      where: {
        commentId,
      },
    });
  }

  async findCommentById(id: string) {
    return await this.prisma.comment.findFirst({
      where: { id: id },
    });
  }
  async findCommentByIdAndUserId(id: string, authorId: string) {
    return await this.prisma.comment.findFirst({
      where: { id, authorId },
    });
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
  public async mentions(mentions, commentId: string, prisma: any) {
    const commentMention = mentions.mentionIds.map((userId) => {
      return Object.assign({}, { mentionId: userId }, { commentId: commentId });
    });
    const user = await this.userService.findUsersByIds(mentions.mentionIds);
    if (user.length) {
      await prisma.commentMentions.createMany({
        data: commentMention,
      });
    }
    return user;
  }
  public async updateMentions(
    mentions: string[],
    commentId: string,
    prisma: any,
  ) {
    const commentMention = mentions.map((userId: string) => {
      return Object.assign({}, { mentionId: userId }, { commentId });
    });
    const user = await this.userService.findUsersByIds(mentions);
    if (user.length) {
      await prisma.commentMentions.deleteMany({
        where: { commentId },
      });

      await prisma.commentMentions.createMany({
        data: commentMention,
      });
    }
    return user;
  }
  async createFirstLevelComment(
    postId: string,
    authorId: string,
    content: string,
    mentions: PostMentionsInput,
  ): Promise<PostFirstLevelCommentPayload> {
    try {
      const comment = await this.prisma.$transaction(async (prisma) => {
        const create = await prisma.comment.create({
          data: {
            authorId,
            postId,
            content,
          },
        });

        if (!mentions.mentionIds) return { create, user: null };
        const user = await this.mentions(mentions, create.id, prisma);
        return { create, user };
      });
      return {
        data: Object.assign(comment.create, { mentions: comment.user }),
      };
    } catch (err) {
      throw new Error(err);
    }
  }
  async updateComment(
    commentId: string,
    input: PostCommentInput,
    mention: PostMentionsInput,
  ): Promise<PostFirstLevelCommentPayload> {
    try {
      const updateReply = await this.prisma.$transaction(async (prisma) => {
        const update = await prisma.comment.update({
          where: { id: commentId },
          data: {
            content: input.content,
          },
        });

        if (!mention.mentionIds) return { update, user: null };
        const user = await this.updateMentions(
          mention.mentionIds,
          commentId,
          prisma,
        );
        return { update, user };
      });

      return {
        data: Object.assign(updateReply.update, {
          mentions: updateReply.user,
        }),
      };
    } catch (err) {
      throw new Error(err);
    }
  }
  async deleteComment(id: string): Promise<PostDeleteCommentPayload> {
    try {
      await this.prisma.$transaction(async (prisma) => {
        await prisma.comment.delete({ where: { id } });
        await prisma.commentMentions.deleteMany({
          where: { commentId: id },
        });
      });
      return { isDeleted: true };
    } catch (err) {
      throw new Error(err);
    }
  }
  async createSecondLevelComment(
    authorId: string,
    commentId: string,
    content: string,
    mention: PostMentionsInput,
  ): Promise<PostSecondLevelCommentPayload> {
    try {
      const createReply = await this.prisma.$transaction(async (prisma) => {
        const create = await prisma.comment.create({
          data: {
            authorId,
            content,
            commentId,
          },
        });
        if (!mention.mentionIds) return { create, user: null };
        const user = await this.mentions(mention, create.id, prisma);
        return { create, user };
      });

      return {
        data: Object.assign(createReply.create, {
          mentions: createReply.user,
        }),
      };
    } catch (err) {
      throw new Error(err);
    }
  }
  // async createThirdLevelComment(
  //   commentId: string,
  //   content: string,
  //   authorId: string,
  //   mention: PostMentionsInput,
  // ): Promise<ThirdLevelCommentPayload> {
  //   try {
  //     const createReply = await this.prisma.$transaction(async () => {
  //       const create = await this.prisma.comment.create({
  //         data: {
  //           content,
  //           authorId,
  //           commentId,
  //         },
  //       });

  //       if (!mention.mentionIds) return { create, user: null };
  //       const user = await this.mentions(mention, create.id);
  //       return { create, user };
  //     });

  //     return {
  //       comment: Object.assign(createReply.create, {
  //         mentions: createReply.user,
  //       }),
  //     };
  //   } catch (err) {
  //     throw new Error(err);
  //   }
  // }
  public async getSecondLevelComment(
    id: string,
    paginate: ConnectionArgs,
    order: OrderCommentsList,
  ) {
    const baseArgs = {
      where: {
        commentId: id,
      },
      orderBy: { [order.orderBy]: order.direction },
    };
    const replies = await findManyCursorConnection(
      (args) => this.prisma.comment.findMany({ ...args, ...baseArgs }),
      () => this.prisma.comment.count({ where: baseArgs.where }),
      { ...paginate },
    );
    return replies;
  }
  public async thirdLevelComment(
    id: string,
    paginate: ConnectionArgs,
    order: OrderCommentsList,
  ) {
    const baseArgs = {
      where: {
        commentId: id,
      },
      orderBy: { [order.orderBy]: order.direction },
    };
    const replies = await findManyCursorConnection(
      (args) => this.prisma.comment.findMany({ ...args, ...baseArgs }),
      () => this.prisma.comment.count({ where: baseArgs.where }),
      { ...paginate },
    );
    return replies;
  }
}
