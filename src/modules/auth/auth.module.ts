import { DEPENDENCIES_AUTH_MODULES } from 'src/config';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { EmailService } from '../email/services/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from '../user/services/password.service';
import { UserService } from '../user/services/user.service';
import { ValidationService } from '../user/services/validation.service';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';

import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from './jwt.strategy';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { AuthResolver } from './resolvers/auth.resolver';
import { RolesGuard } from './guards/roles.guard';
import { GqlAnonymousGuard } from './guards/gql-anonymous.guard';
import { FilesModule } from '../files/files.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { SharpModule } from 'nestjs-sharp';

@Module({
  imports: [
    ...DEPENDENCIES_AUTH_MODULES,
    PrismaModule,
    FilesModule,
    CloudinaryModule,
    SharpModule,
  ],
  providers: [
    TokenService,
    AuthResolver,
    AuthService,
    PrismaService,
    JwtStrategy,
    AnonymousStrategy,
    EmailService,
    UserService,
    PasswordService,
    ValidationService,
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: GqlAnonymousGuard,
    },
  ],
  exports: [JwtModule, JwtStrategy, AuthService, TokenService],
})
export class AuthModule {}
