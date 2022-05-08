import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';
import { CommentModule } from './comment/comment.module';
import { PostModule } from './post/post.module';
import { AddressModule } from './address/address.module';
import { DatabaseModule } from './database/database.module';
import { ApolloDriver } from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      driver: ApolloDriver,
    }),
    UserModule,
    CompanyModule,
    CommentModule,
    PostModule,
    AddressModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
