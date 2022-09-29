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

@Module({
  imports: [PrismaModule, PostModule],
  providers: [LikesResolver, LikesService, LikesRepository, CompanyService],
})
export class LikesModule {}
