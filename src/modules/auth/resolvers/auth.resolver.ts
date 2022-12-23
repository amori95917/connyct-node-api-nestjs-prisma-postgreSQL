import { Auth } from './../entities/auth.entity';
import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { EmailService } from 'src/modules/email/services/email.service';
import {
  RequestResetPasswordInput,
  ResetPasswordInput,
} from 'src/modules/user/dto/change-password.input';
import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';

import { Roles } from '../decorators/role.decorator';
import { Role } from '../enum/role.enum';

import { RequestConfirmEmailInput } from '../dto/confirm.input';
import { LoginInput, LoginLinkAccessInput } from '../dto/login.input';
import { SignupInput } from '../dto/signup.input';
import { Token } from '../entities/token.entity';
import { OTPService } from 'src/modules/otp-verification/services/otp.service';
import { SwitchAccountInput } from '../dto/switch-account.input';
import { GqlAnonymousGuard } from '../guards/gql-anonymous.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(
    private readonly auth: AuthService,
    private readonly userService: UserService,
    private emailService: EmailService,
    private tokenService: TokenService,
    private otpService: OTPService,
  ) {}

  @Mutation(() => Auth)
  async signup(@Args('data') data: SignupInput, @Context() context) {
    try {
      const { user, company, role } = await this.userService.signUp(data);

      await this.emailService.sendEmailConfirmation({
        name: `${user.fullName} `,
        email: user.email,
        emailToken: user.emailToken,
      });

      const token = this.tokenService.generateTokens({
        userId: user.id,
      });
      context.res.cookie('cookie', {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        user: user,
      });
      const { accessToken, refreshToken } = token;
      const otp = await this.otpService.sendOTP(user.id);
      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user,
        role,
        company,
        otp,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  @UseGuards(GqlAnonymousGuard)
  @Mutation(() => Auth)
  async login(
    @Args('data') { emailOrUsername, password }: LoginInput,
    @Context() context,
  ) {
    const { accessToken, refreshToken, user, role, activeRole, company } =
      await this.auth.login(emailOrUsername.toLowerCase(), password, context);
    // if (errors.length) return { errors: errors };
    return {
      accessToken,
      refreshToken,
      user,
      role,
      activeRole,
      company,
    };
  }

  @Mutation(() => Boolean)
  async loginLinkAccess(
    @Args('data') { email }: LoginLinkAccessInput,
  ): Promise<boolean> {
    const { user, accessToken } = await this.auth.loginLinkAccess(
      email.toLowerCase(),
    );
    await this.emailService.sendEmailLinkAccess({
      email: user.email,
      name: `${user.fullName}`,
      token: accessToken,
    });

    return !!user;
  }

  @ResolveField(() => User)
  @Roles(Role.Admin, Role.User)
  async user(@Parent() token: Token) {
    return await this.auth.getUserFromToken(token.accessToken);
  }

  @Mutation(() => Token)
  async refreshToken(@Args('token') token: string) {
    return this.tokenService.refreshToken(token);
  }

  @Mutation(() => Token)
  async confirmEmail(@Args('token') token: string) {
    return await this.auth.confirmEmail(token);
  }

  @Mutation(() => Boolean)
  async requestConfirmEmail(@Args('data') data: RequestConfirmEmailInput) {
    const user = await this.auth.setNewConfirmEmailToken(data.email);

    await this.emailService.sendEmailConfirmation({
      name: `${user.fullName}`,
      email: user.email,
      emailToken: user.emailToken,
    });

    return !!user;
  }

  @Mutation(() => Token)
  async resetPassword(@Args('data') data: ResetPasswordInput) {
    return await this.auth.resetPassword(data.token, data.newPassword);
  }

  @Mutation(() => Boolean)
  async requestResetPassword(
    @Args('data') data: RequestResetPasswordInput,
  ): Promise<boolean> {
    const user = await this.auth.requestResetPassword(data.email);

    await this.emailService.sendEmailResetPassword({
      email: user.email,
      name: `${user.fullName}`,
      passwordToken: user.passwordToken,
    });

    if (user) return true;
    return false;
  }

  @Mutation(() => Boolean)
  @Roles(Role.Admin, Role.Editor, Role.Manager, Role.Owner, Role.User)
  async logout(@Context() context) {
    context.res.clearCookie('cookie-data');
    return true;
  }

  @Mutation(() => Auth)
  @Roles(Role.Admin, Role.Editor, Role.Manager, Role.Owner, Role.User)
  async switchAccount(
    @Args('input') input: SwitchAccountInput,
    @Context() ctx: any,
  ) {
    // retrieve the requested account from the database
    const { accessToken, refreshToken, user, role, company } =
      await this.auth.findUserByIdAndAccountType(
        input.userId,
        input.accountType,
      );

    // return the account to the frontend
    return {
      accessToken,
      refreshToken,
      user,
      role,
      company,
    };
  }
}
