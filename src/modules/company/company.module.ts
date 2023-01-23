import { Module } from '@nestjs/common';

import { CompanyService } from './services/company.service';
import { CompanyResolver } from './resolvers/company.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FilesModule } from '../files/files.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CompanyRepository } from './repository/company.repository';
import { FollowUnfollowRepository } from '../follow-unfollow-company/repository/followUnfollow.repository';
import { FollowUnfollowCompanyModule } from '../follow-unfollow-company/follow-unfollow-company.module';

@Module({
  imports: [
    PrismaModule,
    FilesModule,
    CloudinaryModule,
    FollowUnfollowCompanyModule,
  ],
  providers: [
    CompanyResolver,
    CompanyService,
    CompanyRepository,

    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
  exports: [CompanyService, CompanyRepository],
})
export class CompanyModule {}
