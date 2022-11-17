import { FollowCompanyService } from './../follow-unfollow-company/services/follow-company.service';
import { Module } from '@nestjs/common';
import { CompanyService } from '../company/services/company.service';
import { FileUploadService } from '../files/services/file.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CompanyDiscussionRepository } from './repository/company-discussion.repository';
import { CompanyDiscussionResolver } from './resolvers/company-discussion.resolver';
import { CompanyDiscussionService } from './services/company-discussion.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  providers: [
    CompanyDiscussionResolver,
    CompanyDiscussionService,
    CompanyDiscussionRepository,
    CompanyService,
    FileUploadService,
    FollowCompanyService,
  ],
})
export class CompanyDiscussionModule {}
