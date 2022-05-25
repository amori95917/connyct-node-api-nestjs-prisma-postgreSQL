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

@Module({
  exports: [PostsService, PostsRepository],
  imports: [
    PrismaModule,
    forwardRef(() => RatingModule),
    forwardRef(() => UserModule),
    forwardRef(() => CommentModule),
  ],
  providers: [
    PostsService,
    PostsResolver,
    PostsLoaders,
    PostsRepository,
    TagService,
    TagRepository,
  ],
})
export class PostModule {}
