import { CloudinaryModule } from './../cloudinary/cloudinary.module';
import { Module } from '@nestjs/common';
import { ProductCategoryService } from './product-category/services/product-category.service';
import { ProductCategoryResolver } from './product-category/resolvers/product-category.resolver';
import { ProductCategoryRepository } from './product-category/repository/product-category.repository';
import { ProductCategoryLoader } from './product-category/product-category.loader';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductResolver } from './product/resolvers/product.resolver';
import { ProductService } from './product/services/product.service';
import { ProductRepository } from './product/repository/product.repository';
import { CompanyModule } from '../company/company.module';
import { FilesModule } from '../files/files.module';
import { ProductLoader } from './product/product.loader';

@Module({
  imports: [PrismaModule, CompanyModule, FilesModule, CloudinaryModule],
  providers: [
    ProductCategoryResolver,
    ProductCategoryService,
    ProductCategoryRepository,
    ProductCategoryLoader,
    ProductResolver,
    ProductService,
    ProductRepository,
    ProductLoader,
  ],
})
export class ProductModule {}
