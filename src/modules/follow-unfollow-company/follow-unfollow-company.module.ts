import { FollowCompanyResolver } from './resolvers/follow-company.resolver';
import { FollowCompanyService } from './services/follow-company.service';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FilesModule } from '../files/files.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CompanyRepository } from '../company/repository/company.repository';
import { FollowUnfollowRepository } from './repository/followUnfollow.repository';

@Module({
  imports: [PrismaModule, FilesModule, CloudinaryModule],
  providers: [
    FollowCompanyService,
    FollowCompanyResolver,
    FollowUnfollowRepository,
    CompanyRepository,
  ],

  exports: [FollowCompanyService, FollowUnfollowRepository],
})
export class FollowUnfollowCompanyModule {}
