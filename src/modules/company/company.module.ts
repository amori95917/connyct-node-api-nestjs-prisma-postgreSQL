import { Module } from '@nestjs/common';

import { CompanyService } from './services/company.service';
import { CompanyResolver } from './resolvers/company.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [PrismaModule],
  providers: [
    CompanyResolver,
    CompanyService,
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
})
export class CompanyModule {}
