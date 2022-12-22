import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { findManyCursorConnection } from 'src/modules/prisma/resolvers/pagination/relay.pagination';
import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';
import {
  CommentInput,
  MentionsInput,
  OrderCommentList,
} from '../../dto/comment/comment.input';
import {
  FirstLevelCommentPayload,
  SecondLevelCommentPayload,
  ThirdLevelCommentPayload,
} from '../../entities/comment/createComment.payload';
import { DeleteCommentPayload } from '../../entities/comment/delete-comment.payload';

@Injectable()
export class CommentRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  public async getComments(
    postId: string,
    paginate: ConnectionArgs,
    order: OrderCommentList,
  ) {
    try {
      const baseArgs = {
        where: {
          communityPostId: postId,
          commentId: null,
        },
        orderBy: { [order.orderBy]: order.direction },
      };
      const result = await findManyCursorConnection(
        (args) =>
          this.prisma.communityComment.findMany({ ...args, ...baseArgs }),
        () => this.prisma.communityComment.count({ where: baseArgs.where }),
        { ...paginate },
      );
      return result;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getCommentCount(communityPostId: string) {
    return await this.prisma.communityComment.count({
      where: {
        communityPostId,
      },
    });
  }
  async findCommentById(id: string) {
    return await this.prisma.communityComment.findFirst({
      where: { id: id },
    });
  }
  async findCommentByIdAndUserId(id: string, authorId: string) {
    return await this.prisma.communityComment.findFirst({
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
  async createFirstLevelComment(
    communityPostId: string,
    authorId: string,
    content: string,
    mentions: MentionsInput,
  ): Promise<FirstLevelCommentPayload> {
    try {
      const comment = await this.prisma.$transaction(async () => {
        const create = await this.prisma.communityComment.create({
          data: {
            authorId,
            communityPostId,
            content,
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
  async updateComment(
    commentId: string,
    input: CommentInput,
    mention: MentionsInput,
  ): Promise<FirstLevelCommentPayload> {
    try {
      const updateReply = await this.prisma.$transaction(async () => {
        const update = await this.prisma.communityComment.update({
          where: { id: commentId },
          data: {
            content: input.text,
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
  async deleteComment(id: string): Promise<DeleteCommentPayload> {
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
  async createSecondLevelComment(
    authorId: string,
    commentId: string,
    content: string,
    mention: MentionsInput,
  ): Promise<SecondLevelCommentPayload> {
    try {
      const createReply = await this.prisma.$transaction(async () => {
        const create = await this.prisma.communityComment.create({
          data: {
            authorId,
            content,
            commentId,
          },
        });
        if (!mention.mentionIds) return { create, user: null };
        const user = await this.mentions(mention, create.id);
        return { create, user };
      });

      return {
        comment: Object.assign(createReply.create, {
          mentions: createReply.user,
        }),
      };
    } catch (err) {
      throw new Error(err);
    }
  }
  async createThirdLevelComment(
    commentId: string,
    content: string,
    authorId: string,
    mention: MentionsInput,
  ): Promise<ThirdLevelCommentPayload> {
    try {
      const createReply = await this.prisma.$transaction(async () => {
        const create = await this.prisma.communityComment.create({
          data: {
            content,
            authorId,
            commentId,
          },
        });

        if (!mention.mentionIds) return { create, user: null };
        const user = await this.mentions(mention, create.id);
        return { create, user };
      });

      return {
        comment: Object.assign(createReply.create, {
          mentions: createReply.user,
        }),
      };
    } catch (err) {
      throw new Error(err);
    }
  }
  public async getSecondLevelComment(
    id: string,
    paginate: ConnectionArgs,
    order: OrderCommentList,
  ) {
    const baseArgs = {
      where: {
        commentId: id,
      },
      orderBy: { [order.orderBy]: order.direction },
    };
    const replies = await findManyCursorConnection(
      (args) => this.prisma.communityComment.findMany({ ...args, ...baseArgs }),
      () => this.prisma.communityComment.count({ where: baseArgs.where }),
      { ...paginate },
    );
    return replies;
  }
  public async thirdLevelComment(
    id: string,
    paginate: ConnectionArgs,
    order: OrderCommentList,
  ) {
    const baseArgs = {
      where: {
        commentId: id,
      },
      orderBy: { [order.orderBy]: order.direction },
    };
    const replies = await findManyCursorConnection(
      (args) => this.prisma.communityComment.findMany({ ...args, ...baseArgs }),
      () => this.prisma.communityComment.count({ where: baseArgs.where }),
      { ...paginate },
    );
    return replies;
  }
}
