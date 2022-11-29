import { Module } from '@nestjs/common';
import { CompanyModule } from '../company/company.module';
import { FilesModule } from '../files/files.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CommunityRepository } from './repository/community.repository';
import { CommunityResolver } from './resolvers/community.resolver';
import { CommunityService } from './services/community.service';

@Module({
  imports: [PrismaModule, CompanyModule, FilesModule],
  providers: [CommunityResolver, CommunityService, CommunityRepository],
})
export class CompanyCommunityModule {}
