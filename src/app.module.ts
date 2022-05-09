import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { GraphQLISODateTime } from '@nestjs/graphql';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';
import { CommentModule } from './comment/comment.module';
import { PostModule } from './post/post.module';
import { AddressModule } from './address/address.module';
// import { DatabaseModule } from './database/database.module';
import { ApolloDriver } from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      playground: true,
      plugings: [ApolloServerPluginLandingPageLocalDefault],
      resolvers: { DateTime: GraphQLISODateTime },
    }),
    UserModule,
    CompanyModule,
    CommentModule,
    PostModule,
    AddressModule,
    // DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
