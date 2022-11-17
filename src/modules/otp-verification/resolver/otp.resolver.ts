import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import { User } from 'src/modules/user/entities/user.entity';
import { OTP } from '../entities/otp.entity';
import { OTPPayload } from '../entities/otp.payload';
import { OTPService } from '../services/otp.service';

@Resolver()
export class OTPResolver {
  constructor(private OTPService: OTPService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => OTPPayload)
  async otpVerification(
    @Args('otp') otp: number,
    @CurrentUser() user: User,
  ): Promise<OTPPayload> {
    const otpCheck = await this.OTPService.validateOTP(otp, user.id);
    return { otpCheck };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => OTPPayload)
  async resendOtp(@CurrentUser() user: User): Promise<OTPPayload> {
    return this.OTPService.resendOtp(user);
  }
}
