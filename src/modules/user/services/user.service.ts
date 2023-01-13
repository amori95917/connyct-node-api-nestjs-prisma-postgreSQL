import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { customError, UserIdIsRequired } from 'src/common/errors';

import { SignupInput } from 'src/modules/auth/dto/signup.input';
import { Role } from 'src/modules/auth/enum/role.enum';
import { TokenService } from 'src/modules/auth/services/token.service';
import { PrismaService } from '../../prisma/prisma.service';
import { PasswordService } from './password.service';

import { ChangePasswordInput } from '../dto/change-password.input';
import { FilterListUsers } from '../dto/filter-user.input';
import { OrderListUsers } from '../dto/order-users.input';
import {
  UpdateStatusUserInput,
  UpdateUserInput,
  UserDataInput,
} from '../dto/user.input';

import { FileUpload } from 'graphql-upload';
import { SharpService } from 'nestjs-sharp';
import { USER_CODE } from 'src/common/errors/error.code';
import { USER_MESSAGE } from 'src/common/errors/error.message';
import { STATUS_CODE } from 'src/common/errors/error.statusCode';
import { Auth } from 'src/modules/auth/entities/auth.entity';
import { CloudinaryService } from 'src/modules/cloudinary/services/cloudinary.service';
import { FileUploadService } from 'src/modules/files/services/file.service';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { findManyCursorConnection } from 'src/modules/prisma/resolvers/pagination/relay.pagination';
import { UserProfileInput } from '../dto/userProfile.input';
import { User as UserEntity } from '../entities/user.entity';
import { UserProfilePayload } from '../entities/userProfile.payload';
import { UserProfile } from '../userProfile.model';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  private allowOperation: boolean;

  constructor(
    @Inject(CONTEXT) private context,
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private tokenService: TokenService,
    private fileUploadService: FileUploadService,
    private cloudinary: CloudinaryService,
    private sharp: SharpService,
  ) {
    this.allowOperation = this.context?.req?.user?.isAdmin;
  }

  public setAllowOperation(value: boolean) {
    this.allowOperation = value;
  }

  async list(
    paginate: ConnectionArgs,
    order: OrderListUsers,
    filter?: FilterListUsers,
  ) {
    const role = await this.prisma.role.findUnique({
      where: { name: Role.Admin },
    });
    const baseArgs = {
      orderBy: { [order.orderBy]: order.direction },
      where: {
        userRoles: { none: { role } },
        ...(filter?.isValid && { isValid: filter.isValid }),
        ...(filter?.omni && {
          firstName: { contains: filter.omni, mode: 'insensitive' },
          lastName: { contains: filter.omni, mode: 'insensitive' },
        }),
      },
    };
    const users = await findManyCursorConnection(
      async (args) => await this.prisma.user.findMany({ ...args, ...baseArgs }),
      async () =>
        await this.prisma.user.count({
          where: { userRoles: { none: { role } } },
        }),
      { ...paginate },
    );
    return users;
  }

  async getUser(userId: string): Promise<User> {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    return user;
  }
  async getUserByEmail(email: string): Promise<User> {
    return await this.prisma.user.findFirst({ where: { email } });
  }

  async findUserById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getUserRole(userId: string) {
    try {
      const role = await this.prisma.userRole.findFirst({
        where: { userId },
        include: {
          role: true,
        },
      });
      return role.role;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getUserRoles(userId: string) {
    try {
      const roles = await this.prisma.userRole.findMany({
        where: { userId },
        include: {
          role: true,
        },
      });
      return roles.map((r) => r.role);
    } catch (err) {
      throw new Error(err);
    }
  }

  async getUserActiveRole(user: UserEntity) {
    // TODO: would be better just get activeRole from user
    try {
      const userEntity = await this.prisma.user.findFirst({
        where: {
          id: user.id,
        },
        include: {
          activeRole: true,
        },
      });
      return userEntity.activeRole;
    } catch (err) {
      throw new Error(err);
    }
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
        fullName: params.fullName,
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

  generateUsername(fullName: string, email: string, prisma?: any) {
    // Check if fullName or email is provided
    if (fullName) {
      // Use fullName as the base for the username
      let username = fullName.toLowerCase().replace(/\s/g, '');
      // Check if the username is already taken
      const user = prisma.user.findFirst({
        where: { username: username },
      });
      // If the username is taken, add a random string to make it unique
      if (user) {
        username += Date.now().toString(36);
      }
      return username;
    } else if (email) {
      // Use email as the base for the username
      let username = email.split('@')[0].toLowerCase();
      // Check if the username is already taken
      const user = prisma.user.findFirst({
        where: { username: username },
      });
      // If the username is taken, add a random string to make it unique
      if (user) {
        username += Date.now().toString(36);
      }
      return username;
    }
    // If fullName and email are not provided, throw an error
    throw new Error('Full name or email is required to generate a username');
  }

  async createUserProfile(userId: string, prisma?: any) {
    console.log('here ************************');

    await prisma.userProfile.create({ data: { userId } });
  }

  async assignUserRole(userId: string, roleName: string, prisma?: any) {
    console.log('userId', userId, roleName);
    const role = await prisma.role.findFirst({
      where: { name: roleName },
    });
    console.log('role in assignUserRole', role);
    if (!role) {
      throw new Error(`Role "${roleName}" does not exist`);
    }
    await prisma.userRole.create({
      data: {
        userId,
        roleId: role.id,
      },
    });
  }

  async setActiveRole(userId: string, roleName: string, prisma?: any) {
    const role = await prisma.role.findFirst({
      where: { name: roleName },
    });
    if (!role) {
      throw new Error(`Role "${roleName}" does not exist`);
    }
    await prisma.user.update({
      where: { id: userId },
      data: { activeRole: { connect: { id: role.id } } },
    });
  }

  async createCompany(
    legalName: string,
    email: string,
    hashPassword: string,
    rest: any,
    prisma: any,
  ) {
    const companySlug = this.generateUsername(
      legalName.split(' ')[0],
      email,
      prisma,
    );
    const { owner } = await this.prisma.company.create({
      data: {
        legalName,
        slug: companySlug,
        owner: {
          create: {
            ...rest,
            password: hashPassword,
            username: this.generateUsername(email.split('@')[0], email, prisma),
          },
        },
      },
      include: { owner: { include: { Company: true } } },
    });
    return owner;
  }

  async signUp(payload: SignupInput): Promise<Auth> {
    try {
      const hashPassword = await this.passwordService.hashPassword(
        payload.password,
      );
      const { isCompanyAccount, legalName, ...rest } = payload;
      /**signup logic */

      const result = await this.prisma.$transaction(async (prisma) => {
        // Check if email already exists
        const emailExists = await prisma.user.count({
          where: { email: payload.email },
        });
        if (emailExists) throw new Error('Email already exists');
        // Individual user signup
        if (!isCompanyAccount) {
          if (!payload.fullName) throw new Error('Fullname is required');
          const user = await prisma.user.create({
            data: {
              ...rest,
              password: hashPassword,
              username: this.generateUsername(
                payload.fullName,
                payload.email,
                prisma,
              ),
            },
          });
          await this.createUserProfile(user.id, prisma);
          await this.assignUserRole(user.id, 'USER', prisma);
          await this.setActiveRole(user.id, 'USER', prisma);
          return { user };
        }
        // company signup
        if (legalName.length < 3)
          throw new Error('legal name must be at least 3 characters');
        const companyNameExists = await prisma.company.count({
          where: { legalName: legalName },
        });
        if (companyNameExists) throw new Error('Company already exists');
        const user = await this.createCompany(
          legalName,
          payload.email,
          hashPassword,
          rest,
          prisma,
        );
        await this.createUserProfile(user.id, prisma);
        // create the OWNER role for the user
        await this.assignUserRole(user.id, 'OWNER', prisma);
        await this.assignUserRole(user.id, 'USER', prisma);
        const rolesOfUser = await prisma.userRole.findMany({
          where: { userId: user.id },
          include: { role: true },
        });
        const roles = rolesOfUser.map((userRole) => userRole.role);
        const hasOwnerRole = roles.some((role) => role.name === 'OWNER');
        const activeRole = hasOwnerRole
          ? roles.find((role) => role.name === 'OWNER')
          : roles.find((role) => role.name === 'USER');
        await this.setActiveRole(user.id, activeRole.name, prisma);
        return {
          user: user,
          role: roles,
          activeRole,
          company: user.Company,
        };
      });
      console.log(result, 'incoming user');
      return result;
    } catch (e) {
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

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      return await this.prisma.userProfile.findFirst({ where: { userId } });
    } catch (err) {
      throw new Error(err);
    }
  }

  async editUserProfile(
    userProfile: UserProfileInput,
    file: FileUpload,
    userId: string,
  ): Promise<UserProfilePayload> {
    try {
      const userData = await this.prisma.userProfile.findUnique({
        where: { userId },
      });
      if (!userData)
        return customError(
          USER_MESSAGE.NOT_FOUND,
          USER_CODE.NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
        );
      /**only if file exist */
      /**TODO */
      /**1. Image dimension check */
      let fileUrl;
      if (file) {
        if (userData.profileImage) {
          await this.fileUploadService.deleteImage(
            'user-profile',
            this.cloudinary.getPublicId(userData.profileImage),
          );
        }
        fileUrl = await this.fileUploadService.uploadImage(
          'user-profile',
          file,
        );
        /**check if error exist */
        if (fileUrl.errors) return { errors: fileUrl.errors };
      }
      const userProfileData = await this.prisma.userProfile.update({
        where: {
          userId,
        },
        data: {
          ...userData,
          ...userProfile,
          profileImage: fileUrl,
        },
      });
      return { userProfile: userProfileData };
    } catch (err) {
      throw new Error(err);
    }
  }

  async userConnectionsSummary(userId: string) {
    try {
      const { id, username, fullName, isValid, _count } =
        await this.prisma.user.findFirst({
          where: { id: userId },
          include: {
            _count: {
              select: {
                FollowUnfollowCompany: true,
                FollowedToUser: true,
                FollowedByUser: true,
                CompanyCommunity: true,
              },
            },
          },
        });
      return {
        id,
        username,
        fullName,
        isValid,
        summary: {
          connectedBrands: _count.FollowUnfollowCompany,
          connectedEvangelists: _count.FollowedToUser,
          evangelers: _count.FollowedByUser,
          connectedCommunities: _count.CompanyCommunity,
        },
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async mutualUsers(
    paginate: ConnectionArgs,
    order: OrderListUsers,
    userId: string,
  ) {
    try {
      const baseArgs = {
        orderBy: { [order.orderBy]: order.direction },
        where: {
          AND: [
            { id: { not: userId } },
            {
              FollowUnfollowCompany: {
                some: {
                  AND: [
                    {
                      followedTo: {
                        id: {
                          in: await this.prisma.followUnfollowCompany
                            .findMany({
                              where: {
                                AND: [
                                  { followedById: userId },
                                  { isConnected: true },
                                ],
                              },
                              select: { followedToId: true },
                            })
                            .then((res) =>
                              res.map((result) => result.followedToId),
                            ),
                        },
                      },
                    },
                    { isConnected: true },
                  ],
                },
              },
            },
          ],
        },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          fullName: true,
          username: true,
          email: true,
          isValid: true,
          UserProfile: true,
        },
      };
      const mutualUsers = await findManyCursorConnection(
        async (args) =>
          await this.prisma.user.findMany({ ...args, ...baseArgs }),
        async () =>
          await this.prisma.user.count({
            where: baseArgs.where,
          }),
        { ...paginate },
      );
      const finalData = {
        ...mutualUsers,
        edges: mutualUsers.edges.map((edge) => {
          return {
            ...edge,
            node: {
              ...edge.node,
              userProfile: edge.node.UserProfile,
            },
          };
        }),
      };
      return finalData;
    } catch (err) {
      console.error(err);
    }
  }

  async userFollowers(
    paginate: ConnectionArgs,
    order: OrderListUsers,
    userId: string,
  ) {
    try {
      const baseArgs = {
        orderBy: { [order.orderBy]: order.direction },
        where: {
          id: userId,
        },
        include: {
          FollowedByUser: {
            include: {
              followedBy: true,
            },
          },
        },
      };
      const followers = await findManyCursorConnection(
        async (args) =>
          await this.prisma.user.findMany({ ...args, ...baseArgs }),
        async () =>
          await this.prisma.user.count({
            where: baseArgs.where,
          }),
        { ...paginate },
      );
      return followers;
    } catch (err) {
      console.error(err);
    }
  }

  async userFollowing(
    paginate: ConnectionArgs,
    order: OrderListUsers,
    userId: string,
  ) {
    try {
      const baseArgs = {
        orderBy: { [order.orderBy]: order.direction },
        where: {
          id: userId,
        },
        include: {
          FollowedToUser: {
            include: {
              followedTo: true,
            },
          },
        },
      };
      const followings = await findManyCursorConnection(
        async (args) =>
          await this.prisma.user.findMany({ ...args, ...baseArgs }),
        async () =>
          await this.prisma.user.count({
            where: baseArgs.where,
          }),
        { ...paginate },
      );
      return followings;
    } catch (err) {
      console.error(err);
    }
  }
}
