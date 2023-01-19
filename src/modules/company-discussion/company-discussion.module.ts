import { Module } from '@nestjs/common';
import { CompanyService } from '../company/services/company.service';
import { FileUploadService } from '../files/services/file.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CompanyDiscussionRepository } from './discussion/repository/company-discussion.repository';
import { CompanyDiscussionResolver } from './discussion/resolvers/company-discussion.resolver';
import { CompanyDiscussionService } from './discussion/services/company-discussion.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { DiscussionAnswerResolver } from './discussion-answer/resolvers/discussion-answer.resolver';
import { DiscussionAnswerService } from './discussion-answer/services/discussion-answer.service';
import { DiscussionAnswerRepository } from './discussion-answer/repository/discussion-answer.repository';
import { UserService } from '../user/services/user.service';
import { PasswordService } from '../user/services/password.service';
import { TokenService } from '../auth/services/token.service';
import { UserModule } from '../user/user.module';
import { DiscussionAnswerReplyResolver } from './discussion-answer/resolvers/discussion-asnwer-reply.resolver';
import { FollowUnfollowRepository } from '../follow-unfollow-company/repository/followUnfollow.repository';
import { CompanyRepository } from '../company/repository/company.repository';

@Module({
  imports: [PrismaModule, CloudinaryModule, UserModule],
  providers: [
    CompanyDiscussionResolver,
    CompanyDiscussionService,
    CompanyDiscussionRepository,
    CompanyService,
    FileUploadService,
    FollowUnfollowRepository,
    DiscussionAnswerResolver,
    DiscussionAnswerService,
    DiscussionAnswerRepository,
    DiscussionAnswerReplyResolver,
    CompanyRepository,
  ],
})
export class CompanyDiscussionModule {}
