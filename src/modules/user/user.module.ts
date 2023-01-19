import { FileUploadService } from './../files/services/file.service';
import { CompanyService } from './../company/services/company.service';
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
import { CloudinaryService } from '../cloudinary/services/cloudinary.service';
import { SharpModule } from 'nestjs-sharp';
import { FollowUnfollowRepository } from '../follow-unfollow-company/repository/followUnfollow.repository';
import { CompanyRepository } from '../company/repository/company.repository';

@Module({
  imports: [PrismaModule, AuthModule, SharpModule],
  providers: [
    UserResolver,
    UserService,
    PasswordService,
    PrismaService,
    EmailService,
    ValidationService,
    FollowCompanyService,
    CompanyService,
    FileUploadService,
    CloudinaryService,
    FollowUnfollowRepository,
    CompanyRepository,
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
  exports: [UserService, ValidationService, PasswordService],
})
export class UserModule {}
