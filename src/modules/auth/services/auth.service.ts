import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { customError, InvalidToken, UserNotFound } from 'src/common/errors';

import { TokenService } from './token.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { PasswordService } from 'src/modules/user/services/password.service';
import { ValidationService } from 'src/modules/user/services/validation.service';

import { Operations } from '../enum/operations.enum';

import { Token } from '../entities/token.entity';
import { Auth } from '../entities/auth.entity';
import { USER_MESSAGE } from 'src/common/errors/error.message';
import { USER_CODE } from 'src/common/errors/error.code';
import { STATUS_CODE } from 'src/common/errors/error.statusCode';

@Injectable()
export class AuthService {
  private readonly logger: Logger;

  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly validationService: ValidationService,
    private readonly tokenService: TokenService,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  async login(
    emailOrUsername: string,
    password: string,
    context: any,
  ): Promise<Auth> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
      include: { Company: true },
    });
    console.log(user, 'incoming user');
    if (!user) throw new Error('User does not exist');
    // return customError(
    //   USER_MESSAGE.USER_NOT_FOUND,
    //   USER_CODE.USER_NOT_FOUND,
    //   STATUS_CODE.NOT_FOUND,
    // );
    if (
      !(
        user &&
        (await this.passwordService.validatePassword(password, user.password))
      )
    )
      throw new Error('Username or password incorrect');
    // return customError(
    //   USER_MESSAGE.LOGIN_ERROR,
    //   USER_CODE.LOGIN_ERROR,
    //   STATUS_CODE.BAD_CONFLICT,
    // );
    const token = this.tokenService.generateTokens({
      userId: user.id,
    });
    context.res.cookie('cookie-data', {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      user: user,
    });
    const userRole = await this.prisma.userRole.findFirst({
      where: { userId: user.id },
      include: { role: true },
    });
    if (userRole.role.name === 'OWNER') {
      return {
        user,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        role: userRole.role.name,
        company: user.Company,
      };
    }
    return {
      user,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      role: userRole.role.name,
    };
  }

  async loginLinkAccess(email: string): Promise<{
    user: User;
    accessToken: string;
  }> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw UserNotFound;

    const { accessToken } = this.tokenService.generateTokens({
      userId: user.id,
    });

    return {
      user,
      accessToken,
    };
  }

  async validateUser(userId: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { id: userId } });
  }

  async getUserFromToken(token: string): Promise<User> {
    const decode = this.tokenService.decodeToken(token);
    return await this.prisma.user.findUnique({ where: { id: decode.userId } });
  }

  async setNewConfirmEmailToken(email: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) throw UserNotFound;

      const emailToken = this.tokenService.generateTokenConfirm(
        Operations.EmailConfirm,
        user.id,
      );

      return await this.prisma.user.update({
        where: { id: user.id },
        data: { emailToken },
      });
    } catch (e) {
      this.logger.error('Erro ao gerar novo token de confirmação de email', e);
      throw e;
    }
  }

  async confirmEmail(token: string) {
    try {
      const decodeToken = this.tokenService.verifyTokenConfirm(token);

      const user = await this.prisma.user.findFirst({
        where: { id: decodeToken.userId },
      });

      if (
        decodeToken.operation === Operations.EmailConfirm &&
        user.emailToken === token
      ) {
        await this.prisma.user.update({
          where: { id: decodeToken.userId },
          data: { emailToken: null, confirm: true },
        });
      } else {
        throw InvalidToken;
      }

      return {
        accessToken: this.tokenService.generateAccessToken({
          userId: decodeToken.userId,
        }),
        refreshToken: this.tokenService.generateRefreshToken({
          userId: decodeToken.userId,
        }),
      };
    } catch (e) {
      this.logger.error('Error in confirm email operation', e);
      throw new UnauthorizedException(e);
    }
  }

  async requestResetPassword(email: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) throw UserNotFound;

      const passwordToken = this.tokenService.generateTokenConfirm(
        Operations.ResetPassword,
        user.id,
      );

      return await this.prisma.user.update({
        where: { id: user.id },
        data: { passwordToken },
      });
    } catch (e) {
      this.logger.error('Error in generate new token', e);
      throw e;
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const decodeToken = this.tokenService.verifyTokenConfirm(token);

      const user = await this.prisma.user.findFirst({
        where: { id: decodeToken.userId },
      });

      if (
        decodeToken.operation === Operations.ResetPassword &&
        user.passwordToken === token
      ) {
        await this.prisma.user.update({
          where: { id: decodeToken.userId },
          data: {
            passwordToken: null,
            password: await this.passwordService.hashPassword(newPassword),
          },
        });
      } else {
        throw InvalidToken;
      }

      return {
        accessToken: this.tokenService.generateAccessToken({
          userId: decodeToken.userId,
        }),
        refreshToken: this.tokenService.generateRefreshToken({
          userId: decodeToken.userId,
        }),
      };
    } catch (e) {
      this.logger.error('Error in reset password', e);
      throw new UnauthorizedException(e);
    }
  }
}
