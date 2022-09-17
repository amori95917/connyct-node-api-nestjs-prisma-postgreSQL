import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserService } from '../user/services/user.service';
import { RepliesResolver } from './resolvers/replies.resolver';
import { UserModule } from '../user/user.module';
import { TokenService } from '../auth/services/token.service';
import { AuthModule } from '../auth/auth.module';
import { CommentsRepository } from '../comment/repository/comment.repository';
import { CommentsService } from '../comment/services/comment.service';
import { PostsRepository } from '../post/repository/post.repository';
import { PostModule } from '../post/post.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    PostModule,
  ],
  providers: [RepliesResolver, CommentsRepository, CommentsService],
})
export class RepliesModule {}
