import { Module } from '@nestjs/common';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CompanyCommunityModule } from '../company-community/company-community.module';
import { FilesModule } from '../files/files.module';
import { FollowUnfollowCompanyModule } from '../follow-unfollow-company/follow-unfollow-company.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { CommentRepository } from './repository/comment/comment.repository';
import { CommunityPostRepository } from './repository/post/community-post.repository';
import { FirstLevelCommentResolver } from './resolvers/comment/first-level-comment.resolver';
import { SecondLevelCommentResolver } from './resolvers/comment/second-level-comment.resolver';
import { ThirdLevelCommentResolver } from './resolvers/comment/third-level-comment.resolver';
import { CommunityPostResolver } from './resolvers/post/community-post.resolver';
import { CommentService } from './services/comment/comment.service';
import { CommunityPostService } from './services/post/community-post.service';
import { ReactionResolver } from './resolvers/reactions/reactions.resolver';
import { ReactionService } from './services/reactions/reactions.service';
import { ReactionRepository } from './repository/reactions/reactions.repository';
import { CommunityPostLoader } from './community-post.loader';
import { CommunityPostCommentReactionResolver } from './resolvers/comment-reaction/comment-reaction.resolver';
import { CommunityPostCommentReactionService } from './services/comment-reaction/comment-reaction.service';
import { CommunityPostCommentReactionRepository } from './repository/comment-reaction/comment-reaction.repository';
import { FollowUnfollowRepository } from '../follow-unfollow-company/repository/followUnfollow.repository';
import { CompanyRepository } from '../company/repository/company.repository';

@Module({
  imports: [
    PrismaModule,
    CompanyCommunityModule,
    FilesModule,
    CloudinaryModule,
    FollowUnfollowCompanyModule,
    UserModule,
  ],
  providers: [
    CommunityPostResolver,
    CommunityPostService,
    CommunityPostRepository,
    SecondLevelCommentResolver,
    FirstLevelCommentResolver,
    ThirdLevelCommentResolver,
    CommentService,
    CommentRepository,
    ReactionResolver,
    ReactionService,
    ReactionRepository,
    CommunityPostLoader,
    CommunityPostCommentReactionResolver,
    CommunityPostCommentReactionService,
    CommunityPostCommentReactionRepository,
    FollowUnfollowRepository,
    CompanyRepository,
  ],
})
export class CommunityPostModule {}
