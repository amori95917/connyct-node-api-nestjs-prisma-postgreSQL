import { LikesRepository } from './repository/likes.repository';
import { LikesService } from './services/likes.services';
import { LikesResolver } from './resolvers/likes.resolver';
import { PrismaModule } from './../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { PostsRepository } from '../post/repository/post.repository';
import { TagService } from '../tag/services/tag.service';
import { TagRepository } from '../tag/repository/tag.repository';
import { CompanyService } from '../company/services/company.service';
import { PostModule } from '../post/post.module';
import { FilesModule } from '../files/files.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CompanyRepository } from '../company/repository/company.repository';
import { FollowUnfollowCompanyModule } from '../follow-unfollow-company/follow-unfollow-company.module';

@Module({
  imports: [
    PrismaModule,
    PostModule,
    FilesModule,
    CloudinaryModule,
    FollowUnfollowCompanyModule,
  ],
  providers: [
    LikesResolver,
    LikesService,
    LikesRepository,
    CompanyService,
    CompanyRepository,
  ],
  exports: [LikesRepository],
})
export class LikesModule {}
