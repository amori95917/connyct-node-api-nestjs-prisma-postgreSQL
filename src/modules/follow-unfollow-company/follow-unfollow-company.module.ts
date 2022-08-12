import { CompanyService } from './../company/services/company.service';
import { FollowCompanyResolver } from './resolvers/follow-company.resolver';
import { FollowCompanyService } from './services/follow-company.service';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [FollowCompanyService, FollowCompanyResolver, CompanyService],
})
export class FollowUnfollowCompanyModule {}
