import { IndustryRepository } from './repository/industry.repository';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { IndustryResolver } from './resolvers/industry.resolver';
import { IndustryService } from './services/industry.service';

@Module({
  imports: [PrismaModule],
  providers: [IndustryResolver, IndustryService, IndustryRepository],
})
export class IndustryModule {}
