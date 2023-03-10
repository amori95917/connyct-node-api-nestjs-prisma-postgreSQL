import { graphqlUploadExpress } from 'graphql-upload';
import config from './config/config';
import { GraphqlConfig, ThrottlerConfig } from './config/config.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { AuthModule } from './modules/auth/auth.module';
import { EmailModule } from './modules/email/email.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { CompanyModule } from './modules/company/company.module';
import { PostModule } from './modules/post/post.module';
import { UserMiddleware } from './modules/user/middlewares/user.middleware';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { TagModule } from './modules/tag/tag.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { FollowUnfollowCompanyModule } from './modules/follow-unfollow-company/follow-unfollow-company.module';
import { IndustryModule } from './modules/industry/industry.module';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { LikesModule } from './modules/likes/likes.module';
import { CommentReactionsModule } from './modules/comment-reactions/comment-reactions.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { FilesModule } from './modules/files/files.module';
import { OtpVerificationModule } from './modules/otp-verification/otp-verification.module';
import { CompanyDiscussionModule } from './modules/company-discussion/company-discussion.module';
import { CompanyCommunityModule } from './modules/company-community/company-community.module';
import { CommunityPostModule } from './modules/community-post/community-post.module';
import { ProductModule } from './modules/company-product/product.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    ThrottlerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const throttlerConfig = configService.get<ThrottlerConfig>('throttler');
        return {
          ttl: throttlerConfig.ttl,
          limit: throttlerConfig.limit,
        };
      },
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService) => {
        const graphqlConfig = configService.get<GraphqlConfig>('graphql');
        return {
          sortSchema: graphqlConfig.sortSchema,
          autoSchemaFile: './src/schema.graphql',
          uploads: false,
          installSubscriptionHandlers: true,
          // buildSchemaOptions: {
          //   numberScalarMode: 'integer',
          // },
          debug: graphqlConfig.debug,
          playground: graphqlConfig.playgroundEnabled,
          plugings: [ApolloServerPluginLandingPageLocalDefault],
          context: ({ req, res }) => ({ req, res }),
          cors: {
            credentials: true,
            origin: true,
          },
          formatError: (error: GraphQLError) => {
            const graphQLFormattedError = {
              message: error?.message,
              code: error?.extensions?.code,
              statusCode: error?.extensions?.statusCode,
            };
            return graphQLFormattedError;
          },
          introspection: true,
        };
      },

      inject: [ConfigService],
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    EmailModule,
    CompanyModule,
    TagModule,
    PostModule,
    EmployeeModule,
    FollowUnfollowCompanyModule,
    IndustryModule,
    LikesModule,
    CommentReactionsModule,
    CloudinaryModule,
    FilesModule,
    OtpVerificationModule,
    CompanyDiscussionModule,
    CompanyCommunityModule,
    CommunityPostModule,
    ProductModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(graphqlUploadExpress({ maxFiles: 10 })).forRoutes('graphql');
    consumer.apply(UserMiddleware).forRoutes('*');
  }
}
