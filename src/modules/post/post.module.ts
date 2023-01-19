import { Module, forwardRef } from '@nestjs/common';

import { CommentModule } from '../comment/comment.module';
import { PrismaModule } from '../prisma/prisma.module';
import { RatingModule } from '../rating/rating.module';
import { UserModule } from '../user/user.module';

import PostsLoaders from './post.loader';
import { PostsRepository } from './repository/post.repository';
import { PostsResolver } from './resolvers/post.resolver';
import { PostsService } from './services/post.service';
import { TagService } from '../tag/services/tag.service';
import { TagRepository } from '../tag/repository/tag.repository';
import { CompanyService } from '../company/services/company.service';
import { FilesModule } from '../files/files.module';
import { CloudinaryService } from '../cloudinary/services/cloudinary.service';
import { LikesRepository } from '../likes/repository/likes.repository';
import { CompanyRepository } from '../company/repository/company.repository';

@Module({
  exports: [PostsService, PostsRepository],
  imports: [
    PrismaModule,
    forwardRef(() => RatingModule),
    forwardRef(() => UserModule),
    forwardRef(() => CommentModule),
    FilesModule,
  ],
  providers: [
    PostsService,
    PostsResolver,
    PostsLoaders,
    PostsRepository,
    TagService,
    TagRepository,
    CompanyService,
    CloudinaryService,
    LikesRepository,
    CompanyRepository,
  ],
})
export class PostModule {}
