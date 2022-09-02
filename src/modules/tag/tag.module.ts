import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TagRepository } from './repository/tag.repository';
import { TagResolver } from './resolvers/tag.resolver';
import { TagService } from './services/tag.service';

@Module({
  exports: [TagService, TagRepository],
  imports: [PrismaModule],
  providers: [TagService, TagResolver, TagRepository],
})
export class TagModule {}
