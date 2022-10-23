import { Module } from '@nestjs/common';

import { CompanyService } from './services/company.service';
import { CompanyResolver } from './resolvers/company.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FilesModule } from '../files/files.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, FilesModule, CloudinaryModule],
  providers: [
    CompanyResolver,
    CompanyService,
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
  exports: [CompanyService],
})
export class CompanyModule {}
