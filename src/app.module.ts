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
          installSubscriptionHandlers: true,
          // buildSchemaOptions: {
          //   numberScalarMode: 'integer',
          // },
          debug: graphqlConfig.debug,
          playground: graphqlConfig.playgroundEnabled,
          plugings: [ApolloServerPluginLandingPageLocalDefault],
          context: ({ req }) => ({ req }),
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
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('*');
  }
}
