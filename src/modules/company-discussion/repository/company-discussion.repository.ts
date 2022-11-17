import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { findManyCursorConnection } from 'src/modules/prisma/resolvers/pagination/relay.pagination';
import {
  CompanyDiscussionInput,
  CompanyDiscussionUpdateInput,
} from '../dto/company-discussion.inputs';
import { DiscussionAnswerVoteInput } from '../dto/discussion-answer-vote';
import {
  DiscussionAnswerInput,
  DiscussionAnswerUpdateInput,
  ReplyToAnswerInput,
} from '../dto/discussion-answer.input';
import { DiscussionVoteInput } from '../dto/discussion-vote.input';
import { OrderListDiscussionAnswer } from '../dto/order-discussion-answer.input';
import { OrderListDiscussion } from '../dto/order-discussion.input';
import {
  CompanyDiscussionDeletePayload,
  CompanyDiscussionPayload,
} from '../entities/company-discussion.payload';
import { DiscussionAnswerVotePayload } from '../entities/discussion-answer-vote.payload';
import {
  DiscussionAnswerDeletePayload,
  DiscussionAnswerPayload,
} from '../entities/discussion-answer.payload';
import { DiscussionVotePayload } from '../entities/discussion-vote.payload';

@Injectable()
export class CompanyDiscussionRepository {
  constructor(private prisma: PrismaService) {}

  async createDiscussion(
    input: CompanyDiscussionInput,
    userId: string,
  ): Promise<CompanyDiscussionPayload> {
    try {
      const companyDiscussion = await this.prisma.companyDiscussions.create({
        data: { ...input, userId },
      });
      return { companyDiscussion };
    } catch (err) {
      throw new Error(err);
    }
  }

  async getDiscussionByCompanyId(
    companyId: string,
    paginate: ConnectionArgs,
    order: OrderListDiscussion,
  ) {
    try {
      const discussion = await findManyCursorConnection(
        (args) =>
          this.prisma.companyDiscussions.findMany({
            ...args,
            where: { companyId },
            orderBy: { [order.orderBy]: order.direction },
          }),
        () =>
          this.prisma.companyDiscussions.count({
            where: { companyId },
          }),
        { ...paginate },
      );
      return discussion;
    } catch (err) {
      throw new Error(err);
    }
  }
  async getDiscussionByUserId(userId: string) {
    try {
      const discussion = await this.prisma.companyDiscussions.findMany({
        where: { userId },
      });
      return discussion;
    } catch (err) {
      throw new Error(err);
    }
  }
  async getDiscussionById(id: string) {
    try {
      const discussion = await this.prisma.companyDiscussions.findFirst({
        where: { id },
      });
      return discussion;
    } catch (err) {
      throw new Error(err);
    }
  }
  async getDiscussionByIdAndUserId(id: string, userId: string) {
    try {
      const discussion = await this.prisma.companyDiscussions.findFirst({
        where: { id, userId },
      });
      return discussion;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getDiscussionByCompanyIdAndUserId(companyId: string, userId: string) {
    try {
      const discussion = await this.prisma.companyDiscussions.findFirst({
        where: {
          companyId,
          userId,
        },
      });
      return discussion;
    } catch (err) {
      throw new Error(err);
    }
  }

  async update(
    input: CompanyDiscussionUpdateInput,
    id: string,
  ): Promise<CompanyDiscussionPayload> {
    try {
      const updateDiscussion = await this.prisma.companyDiscussions.update({
        where: { id },
        data: { ...input },
      });
      return { companyDiscussion: updateDiscussion };
    } catch (err) {
      throw new Error(err);
    }
  }

  async delete(id: string): Promise<CompanyDiscussionDeletePayload> {
    try {
      await this.prisma.companyDiscussions.delete({
        where: { id },
      });
      return { isDeleted: true };
    } catch (err) {
      throw new Error(err);
    }
  }

  async createVote(
    input: DiscussionVoteInput,
    userId: string,
  ): Promise<DiscussionVotePayload> {
    try {
      const checkVote = await this.prisma.discussionVote.findFirst({
        where: { vote: input.vote, userId },
      });
      if (!checkVote) {
        const createVote = await this.prisma.discussionVote.create({
          data: {
            ...input,
            userId,
          },
        });
        return { discussionVote: createVote };
      }
      const removeVote = await this.prisma.discussionVote.delete({
        where: { id: checkVote.id },
      });
      return { discussionVote: removeVote };
    } catch (err) {
      throw new Error(err);
    }
  }

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
