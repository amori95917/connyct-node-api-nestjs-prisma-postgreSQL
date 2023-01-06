import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { ProductCategory } from './entities/product-category.entity';
import { ProductCategoryRepository } from './repository/product-category.repository';

@Injectable()
export class ProductCategoryLoader {
  constructor(
    private readonly productCategoryRepository: ProductCategoryRepository,
  ) {}

  public subCategoryLoader = new DataLoader<string, ProductCategory[]>(
    async (ids: string[]) => {
      const category =
        await this.productCategoryRepository.findSubCategoryByIds(ids);
      return ids.map((key) => category.filter((m) => m.parentId === key));
    },
  );

  public categoryLoader = new DataLoader<string, ProductCategory>(
    async (ids: string[]) => {
      return await this.productCategoryRepository.findCategoryByIds(ids);
    },
  );
}
