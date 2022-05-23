import { Module, forwardRef } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { PostModule } from '../post/post.module';
import { RatingModule } from '../rating/rating.module';
import { UserModule } from '../user/user.module';

import CommentsLoader from './comment.loader';
import { CommentsRepository } from './repository/comment.repository';
import { CommentsResolver } from './resolvers/comment.resolver';
import { CommentsService } from './services/comment.service';

@Module({
  exports: [CommentsService, CommentsRepository],
  imports: [
    PrismaModule,
    forwardRef(() => UserModule),
    forwardRef(() => RatingModule),
    forwardRef(() => PostModule),
  ],
  providers: [
    CommentsService,
    CommentsResolver,
    CommentsLoader,
    CommentsRepository,
  ],
})
export class CommentModule {}
