import { Injectable } from '@nestjs/common';
import { ApolloError } from 'apollo-server-express';
import { FilterListCompanies } from 'src/modules/company/dto/filter-company.input';
import { OrderListCompanies } from 'src/modules/company/dto/order-companies.input';
import { CompanyRepository } from 'src/modules/company/repository/company.repository';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import {
  FollowCompanyInput,
  OrderFollowedCompanyList,
} from '../dto/follow-company.input';
import { User } from 'src/modules/user/entities/user.entity';
import { FollowUnfollowCompany } from '@prisma/client';
import { UnfollowCompanyInput } from '../dto/unfollow-company.input';
import { UnfollowPayload } from '../entities/unfollow.payload';
import { FollowUserToUserInput } from '../dto/follow-user.input';
import { FollowUserToUser } from '../entities/follow-user-to-user.entity';
import { UnfollowUserInput } from '../dto/unfollow-user.input';
import { findManyCursorConnection } from 'src/modules/prisma/resolvers/pagination/relay.pagination';

@Injectable()
export class FollowUnfollowRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async followCompany(
    followCompany: FollowCompanyInput,
    userId: string,
  ): Promise<FollowUnfollowCompany> {
    try {
      const follow = await this.prisma.followUnfollowCompany.create({
        data: {
          followedById: userId,
          followedToId: followCompany.followedToId,
        },
      });
      return follow;
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async unfollowCompany(
    company: UnfollowCompanyInput,
    userId: string,
  ): Promise<UnfollowPayload> {
    try {
      await this.prisma.followUnfollowCompany.deleteMany({
        where: {
          followedById: userId,
          followedToId: company.companyId,
        },
      });
      return { isUnfollow: true };
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async companyFollowedByUser(userId: string) {
    return await this.prisma.followUnfollowCompany.findMany({
      where: {
        followedById: userId,
      },
      select: {
        followedToId: true,
      },
    });
  }

  async checkForCommonCompany(companyFollowedByUser, companyFollowedByMe) {
    return companyFollowedByUser.filter((userData) =>
      companyFollowedByMe.some(
        (ownData) => userData.followedToId === ownData.followedToId,
      ),
    );
  }
  async checkFollowedUser(userId: string, targetUserId: string) {
    return await this.prisma.followUserToUser.findFirst({
      where: {
        followedById: userId,
        followedToId: targetUserId,
      },
    });
  }

  async followUserToUser(
    userToUser: FollowUserToUserInput,
    user: User,
  ): Promise<FollowUserToUser> {
    try {
      const follow = await this.prisma.followUserToUser.create({
        data: {
          followedById: user.id,
          followedToId: userToUser.followedToID,
        },
      });
      return follow;
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async unfollowUser(
    targetUser: UnfollowUserInput,
    userId: string,
  ): Promise<UnfollowPayload> {
    try {
      await this.prisma.followUserToUser.deleteMany({
        where: { followedById: userId, followedToId: targetUser.userId },
      });
      return { isUnfollow: true };
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async getCompanyFollowedByUser(
    userId: string,
    paginate: ConnectionArgs,
    order: OrderFollowedCompanyList,
  ) {
    try {
      const baseArgs = {
        orderBy: { [order.orderBy]: order.direction },
        where: { followedById: userId },
        include: { followedTo: true },
      };
      const result = await findManyCursorConnection(
        (args) =>
          this.prisma.followUnfollowCompany.findMany({ ...args, ...baseArgs }),
        () =>
          this.prisma.followUnfollowCompany.count({ where: baseArgs.where }),
        { ...paginate },
      );
      //   {
      //   id: '8156e0b3-e5cb-41ed-8869-727a6b2daf7f',
      //   followedById: '36f0377d-9a42-4f29-82da-29a00059c029',
      //   followedToId: 'c50abde9-5e63-45b9-a2a0-ddc54f892097',
      //   createdAt: 2022-10-04T02:45:23.466Z,
      //   updatedAt: 2022-10-04T02:45:23.466Z,
      //   followedTo: [Object]
      // },
      const getCompanyFollowersCount = async (companyId: string) => {
        const count = await this.companyRepository.getCompanyFollowersCount(
          companyId,
        );
        return count;
      };

      const companyFollowedByUser = {
        ...result,
        edges: result.edges.map(async (companyEdge) => {
          const { followedTo, ...rest } = companyEdge.node;
          // need followedCreatedAt, companyCreatedAt
          return {
            ...companyEdge,
            node: {
              ...companyEdge.node,
              ...rest,
              ...followedTo,
              followers: await getCompanyFollowersCount(companyEdge.node.id),
            },
          };
        }),
      };
      return companyFollowedByUser;
      // const nodes = companyFollowedByUser.map((company) => {
      //   return company.followedTo;
      // });
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async companiesSuggestions(
    userId: string,
    paginate: ConnectionArgs,
    order: OrderListCompanies,
    filter: FilterListCompanies,
  ) {
    try {
      const followedCompany = await this.prisma.followUnfollowCompany.findMany({
        where: {
          followedById: userId,
        },
        select: {
          followedToId: true,
        },
      });
      const companyIds = followedCompany.map((company) => company.followedToId);
      const companies = await this.companyRepository.list(
        paginate,
        order,
        filter,
        companyIds,
      );
      return companies;
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async checkIfUserFollowCompany(companyId: string, userId: string) {
    try {
      return await this.prisma.followUnfollowCompany.findFirst({
        where: { followedById: userId, followedToId: companyId },
      });
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
}
