import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { findManyCursorConnection } from 'src/modules/prisma/resolvers/pagination/relay.pagination';
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
} from '../entities/discussion-answer.payload';

@Injectable()
export class DiscussionAnswerRepository {
  constructor(private prisma: PrismaService) {}
  async getDiscussionAnswerById(id: string) {
    return await this.prisma.discussionAnswer.findFirst({ where: { id } });
  }
  async getDiscussionAnswerByIdAndUserId(id: string, userId: string) {
    return await this.prisma.discussionAnswer.findFirst({
      where: { userId, id },
    });
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
            where: { discussionId },
            orderBy: { [order.orderBy]: order.direction },
          }),
        () => this.prisma.discussionAnswer.count({ where: { discussionId } }),
        { ...paginate },
      );
      console.log(answer, 'incoming answer');
      return answer;
    } catch (err) {
      throw new Error(err);
    }
  }
  async createAnswer(
    answer: DiscussionAnswerInput,
    userId: string,
  ): Promise<DiscussionAnswerPayload> {
    try {
      const discussionAnswer = await this.prisma.discussionAnswer.create({
        data: {
          ...answer,
          userId,
        },
      });
      return { discussionAnswer };
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateAnswer(
    updateAnswer: DiscussionAnswerUpdateInput,
    id: string,
  ): Promise<DiscussionAnswerPayload> {
    try {
      const updateDiscussionAnswer = await this.prisma.discussionAnswer.update({
        where: { id },
        data: {
          ...updateAnswer,
        },
      });
      return { discussionAnswer: updateDiscussionAnswer };
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteAnswer(id: string): Promise<DiscussionAnswerDeletePayload> {
    try {
      await this.prisma.discussionAnswer.delete({ where: { id } });
      return { isDeleted: true };
    } catch (err) {
      throw new Error(err);
    }
  }

  async replyToAnswer(input: ReplyToAnswerInput, userId: string) {
    try {
      const replyToAnswer = await this.prisma.discussionAnswer.create({
        data: { ...input, userId },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async createAnswerVote(
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
