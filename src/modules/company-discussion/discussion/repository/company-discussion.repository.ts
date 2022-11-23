import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { findManyCursorConnection } from 'src/modules/prisma/resolvers/pagination/relay.pagination';
import {
  CompanyDiscussionInput,
  CompanyDiscussionUpdateInput,
} from '../dto/company-discussion.inputs';

import { DiscussionVoteInput } from '../dto/discussion-vote.input';
import { OrderListDiscussion } from '../dto/order-discussion.input';
import {
  CompanyDiscussionDeletePayload,
  CompanyDiscussionPayload,
} from '../entities/company-discussion.payload';

import { DiscussionVotePayload } from '../../discussion-answer/entities/discussion-vote.payload';
import { CreatedBy } from '../entities/createdBy.entity';

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

  async checkOwner(discussionId: string, userId: string): Promise<boolean> {
    try {
      const discussion = await this.prisma.companyDiscussions.findFirst({
        where: { id: discussionId },
      });
      const company = await this.prisma.company.findFirst({
        where: { id: discussion.companyId, ownerId: userId },
      });
      if (company) return true;
    } catch (err) {}
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

  async countVote(discussionId: string) {
    try {
      const count = await this.prisma.discussionVote.count({
        where: { discussionId, vote: 'UPVOTE' },
      });
      return count;
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
      await this.prisma.discussionVote.delete({
        where: { id: checkVote.id },
      });
      return { removeVote: true };
    } catch (err) {
      throw new Error(err);
    }
  }
  async downVote(
    input: DiscussionVoteInput,
    userId: string,
  ): Promise<DiscussionVotePayload> {
    try {
      const checkVote = await this.prisma.discussionVote.findFirst({
        where: { vote: input.vote, userId },
      });
      if (!checkVote) {
        const downVote = await this.prisma.discussionVote.create({
          data: {
            ...input,
            userId,
          },
        });
        return { discussionVote: downVote };
      }
      await this.prisma.discussionVote.delete({
        where: { id: checkVote.id },
      });
      return { removeVote: true };
    } catch (err) {
      throw new Error(err);
    }
  }
  async createdBy(userId: string): Promise<CreatedBy> {
    try {
      const company = await this.prisma.company.findFirst({
        where: { ownerId: userId },
      });
      if (company)
        return {
          id: company.id,
          fullName: company.legalName,
          image: company.avatar,
        };
      const user = await this.prisma.user.findFirst({
        where: { id: userId },
        include: { UserProfile: true },
      });
      return {
        id: userId,
        fullName: user.fullName,
        image: user.UserProfile.profileImage,
      };
    } catch (err) {
      throw new Error(err);
    }
  }
}
