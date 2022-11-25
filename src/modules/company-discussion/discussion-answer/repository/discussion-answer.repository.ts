import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { findManyCursorConnection } from 'src/modules/prisma/resolvers/pagination/relay.pagination';
import { UserService } from 'src/modules/user/services/user.service';
import { DiscussionAnswerVoteInput } from '../dto/discussion-answer-vote';
import {
  DiscussionAnswerInput,
  DiscussionAnswerUpdateInput,
  ReplyToAnswerInput,
} from '../dto/discussion-answer.input';
import { OrderListDiscussionAnswer } from '../dto/order-discussion-answer.input';
import { DiscussionAnswerVotePayload } from '../entities/discussion-answer-vote.payload';
import {
  DiscussionAnswerDeletePayload,
  DiscussionAnswerPayload,
  DiscussionAnswerReplyPayload,
} from '../entities/discussion-answer.payload';

@Injectable()
export class DiscussionAnswerRepository {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async getDiscussionAnswerById(id: string) {
    return await this.prisma.discussionAnswer.findFirst({
      where: { id },
      include: { discussion: { select: { companyId: true } } },
    });
  }
  async getDiscussionAnswerByRepliedId(repliedToAnswerId: string) {
    return await this.prisma.discussionAnswer.findFirst({
      where: { repliedToAnswerId },
    });
  }
  async getDiscussionAnswerByIdAndUserId(id: string, userId: string) {
    return await this.prisma.discussionAnswer.findFirst({
      where: { userId, id },
      include: {
        discussion: true,
      },
    });
  }
  async getDiscussionAnswerReply(
    repliedToAnswerId: string,
    paginate: ConnectionArgs,
    order: OrderListDiscussionAnswer,
  ) {
    try {
      const answer = await findManyCursorConnection(
        (args) =>
          this.prisma.discussionAnswer.findMany({
            ...args,
            where: { repliedToAnswerId },
            orderBy: { [order.orderBy]: order.direction },
          }),
        () =>
          this.prisma.discussionAnswer.count({ where: { repliedToAnswerId } }),
        { ...paginate },
      );
      return answer;
    } catch (err) {
      throw new Error();
    }
  }

  async getDiscussionAnswerByDiscussionId(
    discussionId: string,
    paginate: ConnectionArgs,
    order: OrderListDiscussionAnswer,
  ) {
    try {
      const answer = await findManyCursorConnection(
        (args) =>
          this.prisma.discussionAnswer.findMany({
            ...args,
            where: { discussionId, repliedToAnswerId: null },
            orderBy: { [order.orderBy]: order.direction },
          }),
        () => this.prisma.discussionAnswer.count({ where: { discussionId } }),
        { ...paginate },
      );
      return answer;
    } catch (err) {
      throw new Error(err);
    }
  }

  public async mentions(mentions: string[], answerId: string) {
    const answerMention = mentions.map((userId: string) => {
      return Object.assign({}, { mentionId: userId }, { answerId });
    });
    const user = await this.userService.findUsersByIds(mentions);
    if (user.length) {
      await this.prisma.discussionAnswerMentions.createMany({
        data: answerMention,
      });
    }
    return user;
  }
  public async updateMentions(mentions: string[], answerId: string) {
    const answerMention = mentions.map((userId: string) => {
      return Object.assign({}, { mentionId: userId }, { answerId });
    });
    const user = await this.userService.findUsersByIds(mentions);
    if (user.length) {
      await this.prisma.discussionAnswerMentions.deleteMany({
        where: { answerId },
      });
      await this.prisma.discussionAnswerMentions.createMany({
        data: answerMention,
      });
    }
    return user;
  }

  async countVote(discussionAnswerId: string) {
    try {
      const vote = await this.prisma.discussionAnswerVote.count({
        where: { discussionAnswerId, vote: 'UPVOTE' },
      });
      return vote;
    } catch (err) {
      throw new Error(err);
    }
  }

  async createAnswer(
    answer: DiscussionAnswerInput,
    userId: string,
  ): Promise<DiscussionAnswerPayload> {
    try {
      const discussionAnswer = await this.prisma.$transaction(async () => {
        const createAnswer = await this.prisma.discussionAnswer.create({
          data: {
            answer: answer.answer,
            discussionId: answer.discussionId,
            userId,
          },
        });
        if (!answer.mentionIds) return { createAnswer, user: null };
        const user = await this.mentions(answer.mentionIds, createAnswer.id);
        return { createAnswer, user };
      });
      return {
        discussionAnswer: Object.assign(discussionAnswer.createAnswer, {
          mentions: discussionAnswer.user,
        }),
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async checkOwner(answerId: string, userId: string): Promise<boolean> {
    try {
      const discussionAnswer = await this.prisma.discussionAnswer.findFirst({
        where: { id: answerId },
        include: {
          discussion: {
            select: { companyId: true },
          },
        },
      });
      const company = await this.prisma.company.findFirst({
        where: { id: discussionAnswer.discussion.companyId, ownerId: userId },
      });
      if (company) return true;
    } catch (err) {}
  }

  async updateAnswer(
    updateAnswer: DiscussionAnswerUpdateInput,
    id: string,
  ): Promise<DiscussionAnswerPayload> {
    try {
      const update = await this.prisma.$transaction(async () => {
        const updateDiscussionAnswer =
          await this.prisma.discussionAnswer.update({
            where: { id },
            data: {
              answer: updateAnswer.answer,
            },
          });
        if (!updateAnswer.mentionIds)
          return { updateDiscussionAnswer, user: null };
        const user = await this.updateMentions(updateAnswer.mentionIds, id);
        return { updateDiscussionAnswer, user };
      });

      return {
        discussionAnswer: Object.assign(update.updateDiscussionAnswer, {
          mentions: update.user,
        }),
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteAnswer(id: string): Promise<DiscussionAnswerDeletePayload> {
    try {
      await this.prisma.$transaction(async () => {
        await this.prisma.discussionAnswer.delete({ where: { id } });
        await this.prisma.discussionAnswerMentions.deleteMany({
          where: { answerId: id },
        });
      });
      return { isDeleted: true };
    } catch (err) {
      throw new Error(err);
    }
  }

  async replyToAnswer(
    input: ReplyToAnswerInput,
    userId: string,
  ): Promise<DiscussionAnswerReplyPayload> {
    try {
      const replyToAnswer = await this.prisma.discussionAnswer.create({
        data: { ...input, userId },
      });
      return { discussionAnswerReply: replyToAnswer };
    } catch (err) {
      throw new Error(err);
    }
  }

  async createAnswerVote(
    input: DiscussionAnswerVoteInput,
    userId: string,
  ): Promise<DiscussionAnswerVotePayload> {
    try {
      const vote = await this.prisma.$transaction(async () => {
        const checkVote = await this.prisma.discussionAnswerVote.findFirst({
          where: { vote: input.vote, userId },
        });
        if (!checkVote) {
          const createVote = await this.prisma.discussionAnswerVote.create({
            data: {
              ...input,
              userId,
            },
          });
          return { createVote };
        }
        await this.prisma.discussionAnswerVote.delete({
          where: { id: checkVote.id },
        });
        return { remove: true };
      });
      return { discussionAnswerVote: vote.createVote, removeVote: vote.remove };
    } catch (err) {
      throw new Error(err);
    }
  }
  async createAnswerDownvote(
    input: DiscussionAnswerVoteInput,
    userId: string,
  ): Promise<DiscussionAnswerVotePayload> {
    try {
      const checkVote = await this.prisma.discussionAnswerVote.findFirst({
        where: { vote: input.vote, userId },
      });
      if (!checkVote) {
        const createVote = await this.prisma.discussionAnswerVote.create({
          data: {
            ...input,
            userId,
          },
        });
        return { discussionAnswerVote: createVote };
      }
      const removeVote = await this.prisma.discussionAnswerVote.delete({
        where: { id: checkVote.id },
      });
      return { discussionAnswerVote: removeVote };
    } catch (err) {
      throw new Error(err);
    }
  }
}
