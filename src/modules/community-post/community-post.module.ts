import { Module } from '@nestjs/common';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CompanyCommunityModule } from '../company-community/company-community.module';
import { FilesModule } from '../files/files.module';
import { FollowUnfollowCompanyModule } from '../follow-unfollow-company/follow-unfollow-company.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CommunityPostRepository } from './repository/post/community-post.repository';
import { CommunityPostResolver } from './resolvers/post/community-post.resolver';
import { CommunityPostService } from './services/post/community-post.service';

@Module({
  imports: [
    PrismaModule,
    CompanyCommunityModule,
    FilesModule,
    CloudinaryModule,
    FollowUnfollowCompanyModule,
  ],
  providers: [
    CommunityPostResolver,
    CommunityPostService,
    CommunityPostRepository,
  ],
})
export class CommunityPostModule {}
