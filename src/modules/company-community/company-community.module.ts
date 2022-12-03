import { Module } from '@nestjs/common';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CompanyModule } from '../company/company.module';
import { FilesModule } from '../files/files.module';
import { FollowUnfollowCompanyModule } from '../follow-unfollow-company/follow-unfollow-company.module';
import { FollowCompanyService } from '../follow-unfollow-company/services/follow-company.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { CommunityRepository } from './repository/community.repository';
import { CommunityResolver } from './resolvers/community.resolver';
import { CommunityService } from './services/community.service';

@Module({
  imports: [
    PrismaModule,
    CompanyModule,
    FilesModule,
    UserModule,
    FollowUnfollowCompanyModule,
    CloudinaryModule,
  ],
  providers: [
    CommunityResolver,
    CommunityService,
    CommunityRepository,
    FollowCompanyService,
  ],
})
export class CompanyCommunityModule {}
