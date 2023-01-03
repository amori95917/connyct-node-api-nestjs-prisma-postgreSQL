import { Module, forwardRef } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { PostModule } from '../post/post.module';
import { RatingModule } from '../rating/rating.module';
import { UserModule } from '../user/user.module';

import CommentsLoader from './comment.loader';
import { CommentsRepository } from './repository/comment.repository';
import { CommentsService } from './services/comment.service';
import { FirstLevelCommentResolver } from './resolvers/first-level-comment.resolver';
import { LikesRepository } from '../likes/repository/likes.repository';
import { SecondLevelCommentResolver } from './resolvers/second-level-comment.resolver';

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
    FirstLevelCommentResolver,
    SecondLevelCommentResolver,
    CommentsLoader,
    CommentsRepository,
    LikesRepository,
  ],
})
export class CommentModule {}
