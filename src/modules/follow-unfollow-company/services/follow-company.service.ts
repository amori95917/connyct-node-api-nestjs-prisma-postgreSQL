import { OrderFollowedCompanyList } from 'src/modules/follow-unfollow-company/dto/follow-company.input';
import { Company } from 'src/modules/company/entities/company.entity';
import { UnfollowUserInput } from './../dto/unfollow-user.input';
import { UnfollowCompanyInput } from './../dto/unfollow-company.input';
import { FollowCompanyInput } from '../dto/follow-company.input';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { User } from 'src/modules/user/entities/user.entity';
import { FollowUnfollowCompany, FollowUserToUser } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { FollowUserToUserInput } from '../dto/follow-user.input';
import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';
import { haveNextPage } from 'src/modules/prisma/resolvers/pagination/pagination';

@Injectable()
export class FollowCompanyService {
  constructor(private readonly prisma: PrismaService) {}
  async followCompany(
    followCompany: FollowCompanyInput,
    user: User,
  ): Promise<FollowUnfollowCompany> {
    try {
      const company = await this.prisma.company.findFirst({
        where: { id: followCompany.followedToId },
      });
      if (!company) throw new Error('Company not found');
      const checkFollowCompany =
        await this.prisma.followUnfollowCompany.findFirst({
          where: {
            followedById: user.id,
            followedToId: followCompany.followedToId,
          },
        });
      if (checkFollowCompany) throw new Error('Company already followed');
      const follow = await this.prisma.followUnfollowCompany.create({
        data: {
          followedById: user.id,
          followedToId: followCompany.followedToId,
        },
      });
      return follow;
    } catch (e) {
      throw new Error(e);
    }
  }

  async unfollowCompany(
    company: UnfollowCompanyInput,
    user: User,
  ): Promise<string> {
    try {
      const checkDelete = await this.prisma.followUnfollowCompany.findFirst({
        where: { followedToId: company.companyId },
      });
      if (!checkDelete) throw new Error(`Company doesn't exist`);
      await this.prisma.followUnfollowCompany.deleteMany({
        where: {
          followedById: user.id,
          followedToId: company.companyId,
        },
      });
      return 'Company unfollowed';
    } catch (e) {
      throw new Error(e);
    }
  }

  async followUserToUser(
    userToUser: FollowUserToUserInput,
    user: User,
  ): Promise<FollowUserToUser> {
    try {
      if (user.id === userToUser.followedToID)
        throw new Error('Invalid user ID');
      const companyFollowedByUser =
        await this.prisma.followUnfollowCompany.findMany({
          where: {
            followedById: userToUser.followedToID,
          },
          select: {
            followedToId: true,
          },
        });
      if (!companyFollowedByUser) throw new Error('User not found');
      const companyFollowedByMe =
        await this.prisma.followUnfollowCompany.findMany({
          where: {
            followedById: user.id,
          },
          select: {
            followedToId: true,
          },
        });
      const intersection = companyFollowedByUser.filter((userData) =>
        companyFollowedByMe.some(
          (ownData) => userData.followedToId === ownData.followedToId,
        ),
      );
      if (intersection.length === 0)
        throw new Error(
          'You must follow common company inorder to follow each other',
        );
      const checkUserToUserFollow =
        await this.prisma.followUserToUser.findFirst({
          where: {
            followedById: user.id,
            followedToId: userToUser.followedToID,
          },
        });
      if (checkUserToUserFollow) throw new Error('User already followed');
      const follow = await this.prisma.followUserToUser.create({
        data: {
          followedById: user.id,
          followedToId: userToUser.followedToID,
        },
      });
      return follow;
    } catch (e) {
      throw new Error(e);
    }
  }

  async unfollowUser(userId: UnfollowUserInput, user: User): Promise<string> {
    try {
      // do i need to check for userId in database or?
      const chechDeleteData = await this.prisma.followUserToUser.findFirst({
        where: {
          followedToId: userId.userId,
        },
      });
      if (!chechDeleteData) throw new Error(`User doesn't exist`);
      await this.prisma.followUserToUser.deleteMany({
        where: { followedById: user.id, followedToId: userId.userId },
      });
      return 'User unfollowed';
    } catch (e) {
      throw new Error(e);
    }
  }

  async getCompanyFollowedByUser(
    userId: string,
    paginate: PaginationArgs,
    order: OrderFollowedCompanyList,
  ) {
    try {
      const companyFollowedByUser =
        await this.prisma.followUnfollowCompany.findMany({
          skip: paginate.skip,
          take: paginate.take,
          orderBy: { [order.orderBy]: order.direction },
          where: { followedById: userId },
          include: { followedTo: true },
        });
      if (!companyFollowedByUser.length) return null;
      const nodes = companyFollowedByUser.map((company) => {
        return company.followedTo;
      });
      const totalCount = await this.prisma.followUnfollowCompany.count();
      const hasNextPage = haveNextPage(
        paginate.skip,
        paginate.take,
        totalCount,
      );
      return {
        nodes,
        totalCount,
        hasNextPage,
        edges: nodes?.map((node) => ({
          node,
          cursor: Buffer.from(node.id).toString('base64'),
        })),
      };
    } catch (e) {
      throw new Error(e);
    }
  }
}
