import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

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
      console.log(getOtp, 'incoming otp');
      console.log(
        getOtp.otp === otp && getOtp.expirationDate > new Date(),
        'incoming check',
      );
      if (getOtp.otp === otp && getOtp.expirationDate > new Date()) return true;
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

  async resendOtp(userId: string) {
    try {
      const getOtp = await this.prisma.oTP.findFirst({ where: { userId } });
      if (getOtp.expirationDate > new Date()) return getOtp;
      const { randomOTP, expirationDate } = await this.generateOTP();
      const updateOtp = await this.prisma.oTP.update({
        where: { id: getOtp.id },
        data: {
          otp: randomOTP,
          expirationDate,
        },
      });
      return updateOtp;
    } catch (err) {
      throw new Error(err);
    }
  }
}
