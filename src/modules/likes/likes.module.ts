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

@Module({
  imports: [PrismaModule, PostModule, FilesModule, CloudinaryModule],
  providers: [LikesResolver, LikesService, LikesRepository, CompanyService],
  exports: [LikesRepository],
})
export class LikesModule {}
