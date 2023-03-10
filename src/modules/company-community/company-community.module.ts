import { Module } from '@nestjs/common';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CompanyModule } from '../company/company.module';
import { FilesModule } from '../files/files.module';
import { FollowUnfollowCompanyModule } from '../follow-unfollow-company/follow-unfollow-company.module';
import { FollowCompanyService } from '../follow-unfollow-company/services/follow-company.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { CommunityRepository } from './repository/community.repository';
import { CommunityMemberResolver } from './resolvers/community-members.resolver';
import { CommunityResolver } from './resolvers/community.resolver';
import { CommunityPolicyResolver } from './resolvers/policy.resolver';
import { CommunityService } from './services/community.service';
import { FollowUnfollowRepository } from '../follow-unfollow-company/repository/followUnfollow.repository';
import { CompanyRepository } from '../company/repository/company.repository';

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
    CommunityMemberResolver,
    CommunityPolicyResolver,
    CommunityService,
    CommunityRepository,
    CompanyRepository,
    FollowCompanyService,
    FollowUnfollowRepository,
  ],
  exports: [CommunityRepository],
})
export class CompanyCommunityModule {}
