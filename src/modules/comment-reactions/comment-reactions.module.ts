import { CommentReactionsResolver } from './resolvers/comment-reactions.resolver';
import { Module } from '@nestjs/common';
import { CommentReactionsService } from './services/comment-reactions.service';
import { CommentReactionsRepository } from './repository/comment-reactions.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { CommentsRepository } from '../comment/repository/comment.repository';
import { LikesRepository } from '../likes/repository/likes.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, UserModule],
  providers: [
    CommentReactionsResolver,
    CommentReactionsService,
    CommentReactionsRepository,
    CommentsRepository,
    LikesRepository,
  ],
})
export class CommentReactionsModule {}
