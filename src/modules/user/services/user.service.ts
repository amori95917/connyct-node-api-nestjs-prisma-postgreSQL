import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { EmailConflict, UserIdIsRequired } from 'src/common/errors';

import { PrismaService } from '../../prisma/prisma.service';
import { PasswordService } from './password.service';
import { SignupInput } from 'src/modules/auth/dto/signup.input';
import { Operations } from 'src/modules/auth/enum/operations.enum';
import { Role } from 'src/modules/auth/enum/role.enum';
import { TokenService } from 'src/modules/auth/services/token.service';
import { haveNextPage } from 'src/modules/prisma/resolvers/pagination/pagination';
import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';

import { ChangePasswordInput } from '../dto/change-password.input';
import { FilterListUsers } from '../dto/filter-user.input';
import { OrderListUsers } from '../dto/order-users.input';
import {
  UpdateStatusUserInput,
  UpdateUserInput,
  UserDataInput,
} from '../dto/user.input';

import { v4 } from 'uuid';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  private allowOperation: boolean;

  constructor(
    @Inject(CONTEXT) private context,
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private tokenService: TokenService,
  ) {
    this.allowOperation = this.context?.req?.user?.isAdmin;
  }

  public setAllowOperation(value: boolean) {
    this.allowOperation = value;
  }

  async list(
    paginate: PaginationArgs,
    order: OrderListUsers,
    filter?: FilterListUsers,
  ) {
    const role = await this.prisma.role.findUnique({
      where: { name: Role.Admin },
    });
    const nodes = await this.prisma.user.findMany({
      skip: paginate.skip,
      take: paginate.take,
      orderBy: { [order.orderBy]: order.direction },
      where: {
        userRoles: { none: { role } },
        ...(filter?.isValid && { isValid: filter.isValid }),
        ...(filter?.omni && {
          firstName: { contains: filter.omni, mode: 'insensitive' },
          lastName: { contains: filter.omni, mode: 'insensitive' },
        }),
      },
    });
    console.log('nodes', nodes);
    const totalCount = await this.prisma.user.count({
      where: { userRoles: { none: { role } } },
    });
    const hasNextPage = haveNextPage(paginate.skip, paginate.take, totalCount);
    return {
      nodes,
      totalCount,
      hasNextPage,
      edges: nodes?.map((node) => ({
        node,
        cursor: Buffer.from(node.id).toString('base64'),
      })),
    };
  }

  async getUser(userId: string): Promise<User> {
    return await this.prisma.user.findFirst({ where: { id: userId } });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.prisma.user.findFirst({ where: { email } });
  }

  async findUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  public async findUsersByIds(authorIds: readonly string[]): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        id: {
          in: [...authorIds],
        },
      },
    });
  }

  async updateUser(userId: string, params: UpdateUserInput): Promise<User> {
    const userOwnId = this.allowOperation ? params.userId : userId;
    if (this.allowOperation && !params?.userId) throw UserIdIsRequired;

    return await this.prisma.user.update({
      data: {
        firstName: params.firstName,
        lastName: params.lastName,
      },
      where: {
        id: userOwnId,
      },
    });
  }

  async changePassword(
    userId: string,
    userPassword: string,
    changePassword: ChangePasswordInput,
  ): Promise<User> {
    const passwordValid = await this.passwordService.validatePassword(
      changePassword.oldPassword,
      userPassword,
    );

    if (!passwordValid) throw new BadRequestException('Senha inválida');

    const hashedPassword = await this.passwordService.hashPassword(
      changePassword.newPassword,
    );

    return this.prisma.user.update({
      data: {
        password: hashedPassword,
      },
      where: { id: userId },
    });
  }

  async signUp(payload: SignupInput): Promise<User> {
    try {
      const hashPassword = await this.passwordService.hashPassword(
        payload.password,
      );
      const { isCompanyAccount, legalName, ...rest } = payload;
      const email = await this.prisma.user.findFirst({
        where: { email: payload.email },
      });
      if (email) throw new Error('Email already exist');

      //function to assign roles to user
      const userRoles = async (userId, roleId) => {
        await this.prisma.userRole.create({
          data: {
            userId: userId,
            roleId: roleId,
          },
        });
      };
      // indivaidual signup
      if (!isCompanyAccount) {
        const user = await this.prisma.user.create({
          data: {
            ...rest,
            password: hashPassword,
          },
        });
        const role = await this.prisma.role.findFirst({
          where: {
            name: 'USER',
          },
        });
        userRoles(user.id, role.id);
        return user;
        // TODO username should be generated uniquely if not provided
      }

      // company signup
      if (legalName.length < 3) {
        throw new Error('Legal name must be longer than 3 characters');
      }
      const companyName = await this.prisma.company.findFirst({
        where: { legalName: legalName },
      });
      if (companyName) throw new Error('Company name already exist');
      await this.prisma.company.create({
        data: {
          legalName: legalName,
          owner: {
            connectOrCreate: {
              where: { email: payload.email },
              create: { ...rest, password: hashPassword },
            },
          },
        },
        include: {
          owner: true,
        },
      });
      const user = await this.prisma.user.findFirst({
        where: { email: payload.email },
      });
      const role = await this.prisma.role.findFirst({
        where: {
          name: 'OWNER',
        },
      });
      userRoles(user.id, role.id);
      return user;
    } catch (e) {
      console.log('error singup', e);
      throw new Error(e);
    }
  }

  async createUser(data: UserDataInput): Promise<User> {
    const hashedPassword = await this.passwordService.hashPassword(
      data.password,
    );

    let role = null;
    const { isCompanyAccount } = data;
    if (isCompanyAccount) {
      role = await this.prisma.role.findFirst({ where: { name: Role.Owner } });
    }
    return await this.prisma.user.create({
      data: {
        ...data,
        email: data.email.toLowerCase(),
        password: hashedPassword,
        ...(isCompanyAccount && {
          userRoles: { create: { roleId: role.id } },
        }),
      },
    });
  }

  async updateStatusUser(data: UpdateStatusUserInput) {
    return await this.prisma.user.update({
      where: { id: data.userId },
      data: { isValid: data.status },
    });
  }
}
