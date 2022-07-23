import { FollowCompanyService } from './../follow-unfollow-company/services/follow-company.service';
import { Module } from '@nestjs/common';

import { EmailService } from '../email/services/email.service';
import { PrismaService } from 'prisma/prisma.service';
import { PasswordService } from './services/password.service';
import { UserService } from './services/user.service';
import { ValidationService } from './services/validation.service';

import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserResolver } from './resolvers/user.resolver';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [
    UserResolver,
    UserService,
    PasswordService,
    PrismaService,
    EmailService,
    ValidationService,
    FollowCompanyService,
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
  exports: [UserService, ValidationService, PasswordService],
})
export class UserModule {}
