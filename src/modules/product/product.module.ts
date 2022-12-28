import { Module } from '@nestjs/common';
import { ProductCategoryService } from './product-category/services/product-category.service';
import { ProductCategoryResolver } from './product-category/resolvers/product-category.resolver';
import { ProductCategoryRepository } from './product-category/repository/product-category.repository';
import { ProductCategoryLoader } from './product-category/product-category.loader';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    ProductCategoryResolver,
    ProductCategoryService,
    ProductCategoryRepository,
    ProductCategoryLoader,
  ],
})
export class ProductModule {}
