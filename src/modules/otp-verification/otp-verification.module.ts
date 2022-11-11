import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { OTPResolver } from './resolver/otp.resolver';
import { OTPService } from './services/otp.service';

@Module({
  imports: [PrismaModule],
  providers: [OTPService, OTPResolver],
  exports: [OTPService],
})
export class OtpVerificationModule {}
