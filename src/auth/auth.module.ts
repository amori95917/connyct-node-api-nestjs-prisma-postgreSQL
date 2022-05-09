import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { EnvironmentVariables } from '../config/env.type';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';

import { PrismaService } from '../../prisma/prisma.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { GqlAnonymousGuard } from './guards/gql-anonymous.guard';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: EnvironmentVariables.jwtSecret,
    }),
    forwardRef(() => UserModule),
  ],
  providers: [
    PrismaService,
    UserService,
    AuthService,
    AuthResolver,
    JwtStrategy,
    AnonymousStrategy,
    GqlAuthGuard,
    GqlAnonymousGuard,
  ],
})
export class AuthModule {}
