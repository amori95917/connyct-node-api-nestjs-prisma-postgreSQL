import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserService } from '../user/services/user.service';
import { RepliesResolver } from './resolvers/replies.resolver';
import { UserModule } from '../user/user.module';
import { TokenService } from '../auth/services/token.service';
import { AuthModule } from '../auth/auth.module';
import { CommentsRepository } from '../comment/repository/comment.repository';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
  ],
  providers: [RepliesResolver, CommentsRepository],
})
export class RepliesModule {}
