import { Module } from '@nestjs/common';
import { ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule, GraphQLISODateTime } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { prisma } from '@prisma/client';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';
import { CommentModule } from './comment/comment.module';
import { PostModule } from './post/post.module';
import { AddressModule } from './address/address.module';
// import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import directiveResolvers from './common/directives';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      playground: true,
      plugings: [ApolloServerPluginLandingPageLocalDefault],
      resolvers: { DateTime: GraphQLISODateTime },
      context: (req) => ({
        ...req,
        prisma,
      }),
      // context: (req) => ({
      //   ...req,
      //   prisma
      // }),
      directiveResolvers,
    }),
    UserModule,
    CompanyModule,
    CommentModule,
    PostModule,
    AddressModule,
    AuthModule,
    // DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
