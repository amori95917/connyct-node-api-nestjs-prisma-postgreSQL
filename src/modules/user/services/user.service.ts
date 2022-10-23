import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { User } from '@prisma/client';
import {
  customError,
  EmailConflict,
  UserIdIsRequired,
} from 'src/common/errors';

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
import { Auth } from 'src/modules/auth/entities/auth.entity';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { findManyCursorConnection } from 'src/modules/prisma/resolvers/pagination/relay.pagination';
import { UserProfileInput } from '../dto/userProfile.input';
import { FileUpload } from 'graphql-upload';
import { FileUploadService } from 'src/modules/files/services/file.service';
import { UserProfilePayload } from '../entities/userProfile.payload';
import { COMPANY_MESSAGE, USER_MESSAGE } from 'src/common/errors/error.message';
import { COMPANY_CODE, USER_CODE } from 'src/common/errors/error.code';
import { STATUS_CODE } from 'src/common/errors/error.statusCode';
import { CloudinaryService } from 'src/modules/cloudinary/services/cloudinary.service';
import { SharpService } from 'nestjs-sharp';

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
    return await this.prisma.user.findUnique({ where: { id } });
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

  async signUp(payload: SignupInput): Promise<Auth> {
    try {
      // const hashPassword = await this.passwordService.hashPassword(
      //   payload.password,
      // );
      // const { isCompanyAccount, legalName, ...rest } = payload;
      // const email = await this.prisma.user.findFirst({
      //   where: { email: payload.email },
      // });
      // if (email) throw new Error('Email already exist');
      // //function to assign roles to user
      // const userRoles = async (userId, roleId) => {
      //   await this.prisma.userRole.create({
      //     data: {
      //       userId: userId,
      //       roleId: roleId,
      //     },
      //   });
      // };
      // //* create random username /
      // const userName = (name: string) => {
      //   const result = Date.now().toString(36);
      //   return (name + result).toLowerCase();
      // };
      // // individual signup
      // if (!isCompanyAccount) {
      //   if (!payload.fullName) throw new Error('Fullname is required');
      //   const user = await this.prisma.user.create({
      //     data: {
      //       ...rest,
      //       // generate unique username based on email or firstname and lastnamex
      //       // username: rest.username || rest.email,
      //       password: hashPassword,
      //       username: userName(payload.fullName),
      //       UserProfile: {
      //         create: [],
      //       },
      //     },
      //   });
      //   const role = await this.prisma.role.findFirst({
      //     where: {
      //       name: 'USER',
      //     },
      //   });
      //   userRoles(user.id, role.id);
      //   return { user, role: role.name };
      //   // TODO username should be generated uniquely if not provided
      // }
      // // company signup
      // if (legalName.length < 3) {
      //   throw new Error('Legal name must be longer than 3 characters');
      // }
      // const companyName = await this.prisma.company.findFirst({
      //   where: { legalName: legalName },
      // });
      // if (companyName) throw new Error('Company name already exist');
      // await this.prisma.company.create({
      //   data: {
      //     legalName: legalName,
      //     owner: {
      //       connectOrCreate: {
      //         where: { email: payload.email },
      //         create: {
      //           ...rest,
      //           password: hashPassword,
      //           username: userName(payload.email.split('@')[0]),
      //         },
      //       },
      //     },
      //   },
      //   include: {
      //     owner: true,
      //   },
      // });
      // const user = await this.prisma.user.findFirst({
      //   where: { email: payload.email },
      //   include: { Company: true },
      // });
      // const role = await this.prisma.role.findFirst({
      //   where: {
      //     name: 'OWNER',
      //   },
      // });
      // userRoles(user.id, role.id);
      // return {
      //   user: user,
      //   role: role.name,
      //   company: user.Company,
      // };
      // const hashPassword = await this.passwordService.hashPassword(
      //   payload.password,
      // );
      // const { isCompanyAccount, legalName, ...rest } = payload;
      // /**signup logic */
      // //function to assign roles to user
      // const userRoles = async (userId, roleId) => {
      //   await this.prisma.userRole.create({
      //     data: {
      //       userId: userId,
      //       roleId: roleId,
      //     },
      //   });
      // };
      // //* create random username /
      // const userName = (name: string) => {
      //   const result = Date.now().toString(36);
      //   return (name + result).toLowerCase();
      // };
      // const result = await this.prisma.$transaction(async () => {
      //   /**check if email already exist */
      //   const email = await this.prisma.user.findFirst({
      //     where: { email: payload.email },
      //   });
      //   if (email)
      //     return customError(
      //       USER_MESSAGE.ALREADY_EXIST,
      //       USER_CODE.EMAIL_ALREADY_EXIST,
      //       STATUS_CODE.BAD_REQUEST_EXCEPTION,
      //     );
      //   if (!isCompanyAccount) {
      //     if (!payload.fullName)
      //       return customError(
      //         USER_MESSAGE.FULLNAME_REQUIRED,
      //         USER_CODE.FULLNAME_REQUIRED,
      //         STATUS_CODE.BAD_CONFLICT,
      //       );
      //     const user = await this.prisma.user.create({
      //       data: {
      //         ...rest,
      //         // generate unique username based on email or firstname and lastnamex
      //         // username: rest.username || rest.email,
      //         password: hashPassword,
      //         username: userName(payload.fullName),
      //       },
      //     });
      //     const role = await this.prisma.role.findFirst({
      //       where: {
      //         name: 'USER',
      //       },
      //     });
      //     await this.prisma.userProfile.create({
      //       data: {
      //         userId: user.id,
      //       },
      //     });
      //     userRoles(user.id, role.id);
      //     return { user, role: role.name };
      //     // TODO username should be generated uniquely if not provided
      //   }
      //   // company signup
      //   if (legalName.length < 3) {
      //     return customError(
      //       COMPANY_MESSAGE.INVALID_LEGALNAME_FORMAT,
      //       COMPANY_CODE.INVALID_LEGALNAME_FORMAT,
      //       STATUS_CODE.NOT_SUPPORTED,
      //     );
      //   }
      //   const companyName = await this.prisma.company.findFirst({
      //     where: { legalName: legalName },
      //   });
      //   if (companyName)
      //     return customError(
      //       COMPANY_MESSAGE.ALREADY_EXIST,
      //       COMPANY_CODE.ALREADY_EXIST,
      //       STATUS_CODE.BAD_REQUEST_EXCEPTION,
      //     );
      //   await this.prisma.company.create({
      //     data: {
      //       legalName: legalName,
      //       owner: {
      //         connectOrCreate: {
      //           where: { email: payload.email },
      //           create: {
      //             ...rest,
      //             password: hashPassword,
      //             username: userName(payload.email.split('@')[0]),
      //           },
      //         },
      //       },
      //     },
      //     include: {
      //       owner: true,
      //     },
      //   });
      //   const user = await this.prisma.user.findFirst({
      //     where: { email: payload.email },
      //     include: { Company: true },
      //   });
      //   const role = await this.prisma.role.findFirst({
      //     where: {
      //       name: 'OWNER',
      //     },
      //   });
      //   userRoles(user.id, role.id);
      //   return {
      //     user: user,
      //     role: role.name,
      //     company: user.Company,
      //   };
      // });
      // console.log(result, 'incoming result');
      // return result;
      // const hashPassword = await this.passwordService.hashPassword(
      //   payload.password,
      // );
      // const { isCompanyAccount, legalName, ...rest } = payload;
      // /**signup logic */
      // //function to assign roles to user
      // const userRoles = async (userId, roleId) => {
      //   await this.prisma.userRole.create({
      //     data: {
      //       userId: userId,
      //       roleId: roleId,
      //     },
      //   });
      // };
      // const result = await this.prisma.$transaction(async () => {
      //   /**check if email already exist */
      //   const email = await this.prisma.user.findFirst({
      //     where: { email: payload.email },
      //   });
      //   console.log('incoming request');
      //   if (email)
      //     return customError(
      //       USER_MESSAGE.ALREADY_EXIST,
      //       USER_CODE.EMAIL_ALREADY_EXIST,
      //       STATUS_CODE.BAD_REQUEST_EXCEPTION,
      //     );
      // });
      // return result;

      const hashPassword = await this.passwordService.hashPassword(
        payload.password,
      );
      const { isCompanyAccount, legalName, ...rest } = payload;
      /**signup logic */
      //function to assign roles to user
      const userRoles = async (userId, roleId) => {
        await this.prisma.userRole.create({
          data: {
            userId: userId,
            roleId: roleId,
          },
        });
      };
      //* create random username /
      const userName = (name: string) => {
        const result = Date.now().toString(36);
        return (name + result).toLowerCase();
      };
      const result = await this.prisma.$transaction(async () => {
        /**check if email already exist */
        const email = await this.prisma.user.findFirst({
          where: { email: payload.email },
        });
        if (email) throw new Error('Email already exists');
        if (!isCompanyAccount) {
          if (!payload.fullName) throw new Error('Fullname is required');
          const user = await this.prisma.user.create({
            data: {
              ...rest,
              // generate unique username based on email or firstname and lastnamex
              // username: rest.username || rest.email,
              password: hashPassword,
              username: userName(payload.fullName),
            },
          });
          const role = await this.prisma.role.findFirst({
            where: {
              name: 'USER',
            },
          });
          await this.prisma.userProfile.create({
            data: {
              userId: user.id,
            },
          });
          userRoles(user.id, role.id);
          return { user, role: role.name };
          // TODO username should be generated uniquely if not provided
        }
        // company signup
        if (legalName.length < 3)
          throw new Error('legal name must be at least 3 characters');
        const companyName = await this.prisma.company.findFirst({
          where: { legalName: legalName },
        });
        if (companyName) throw new Error('Company already exists');
        await this.prisma.company.create({
          data: {
            legalName: legalName,
            owner: {
              connectOrCreate: {
                where: { email: payload.email },
                create: {
                  ...rest,
                  password: hashPassword,
                  username: userName(payload.email.split('@')[0]),
                },
              },
            },
          },
          include: {
            owner: true,
          },
        });
        const user = await this.prisma.user.findFirst({
          where: { email: payload.email },
          include: { Company: true },
        });
        const role = await this.prisma.role.findFirst({
          where: {
            name: 'OWNER',
          },
        });
        userRoles(user.id, role.id);
        return {
          user: user,
          role: role.name,
          company: user.Company,
        };
      });
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
}
