import { Module, forwardRef } from '@nestjs/common';

import { CommentModule } from '../comment/comment.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PostModule } from '../post/post.module';

import { RatingRepository } from './repository/rating.repository';
import { RatingService } from './services/rating.service';

@Module({
  exports: [RatingService, RatingRepository],
  imports: [
    PrismaModule,
    forwardRef(() => PostModule),
    forwardRef(() => CommentModule),
  ],
  providers: [RatingService, RatingRepository],
})
export class RatingModule {}
