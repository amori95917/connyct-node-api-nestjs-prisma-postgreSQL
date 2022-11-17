import { Injectable } from '@nestjs/common';
import { customError } from 'src/common/errors';
import { USER_CODE } from 'src/common/errors/error.code';
import { USER_MESSAGE } from 'src/common/errors/error.message';
import { STATUS_CODE } from 'src/common/errors/error.statusCode';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { User } from 'src/modules/user/entities/user.entity';
import { OTPPayload } from '../entities/otp.payload';

@Injectable()
export class OTPService {
  constructor(private readonly prisma: PrismaService) {}

  async generateOTP() {
    const randomOTP = Math.floor(100000 + Math.random() * 900000);
    const expirationDate = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
    return { randomOTP, expirationDate };
  }

  async validateOTP(otp: number, userId: string) {
    try {
      const getOtp = await this.prisma.oTP.findFirst({
        where: { otp, userId },
      });
      if (getOtp.otp === otp && getOtp.expirationDate > new Date()) {
        await this.prisma.oTP.delete({ where: { id: getOtp.id } });
        return true;
      }
      return false;
    } catch (err) {
      throw new Error(err);
    }
  }

  async sendOTP(userId: string) {
    try {
      const { randomOTP, expirationDate } = await this.generateOTP();
      const createOtp = await this.prisma.oTP.create({
        data: { otp: randomOTP, expirationDate, userId },
      });
      return createOtp;
    } catch (err) {
      throw new Error(err);
    }
  }

  async resendOtp(user: User): Promise<OTPPayload> {
    try {
      const { id, isEmailVerified } = user;
      if (isEmailVerified)
        return customError(
          USER_MESSAGE.ACCOUNT_IS_VERIFIED,
          USER_CODE.ACCOUNT_IS_VERIFIED,
          STATUS_CODE.BAD_REQUEST_EXCEPTION,
        );
      const getOtp = await this.prisma.oTP.findFirst({
        where: { userId: id },
      });
      if (getOtp.expirationDate > new Date()) return { otp: getOtp };
      const { randomOTP, expirationDate } = await this.generateOTP();
      const updateOtp = await this.prisma.oTP.update({
        where: { id: getOtp.id },
        data: {
          otp: randomOTP,
          expirationDate,
        },
      });
      return { otp: updateOtp };
    } catch (err) {
      throw new Error(err);
    }
  }
}
