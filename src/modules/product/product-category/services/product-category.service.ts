import { Injectable } from '@nestjs/common';
import { ProductCategoryRepository } from '../repository/product-category.repository';
import { ProductCategory } from '../entities/product-category.entity';
import { ProductCategoryPayload } from '../entities/product-category.payload';
import { ProductCategoryInput } from '../dto/product-category.input';
import { customError } from 'src/common/errors';
import { PRODUCT_CATEGORY_MESSAGE } from 'src/common/errors/error.message';
import { PRODUCT_CATEGORY_CODE } from 'src/common/errors/error.code';
import { STATUS_CODE } from 'src/common/errors/error.statusCode';

@Injectable()
export class ProductCategoryService {
  constructor(
    private readonly productCategoryRepository: ProductCategoryRepository,
  ) {}

  async getProductCategories(): Promise<ProductCategory[]> {
    return await this.productCategoryRepository.getProductCategories();
  }

  async rootProductCategory(): Promise<ProductCategory[]> {
    return await this.productCategoryRepository.rootProductCategory();
  }
  async subCategoryList(parentId: string): Promise<ProductCategory[]> {
    return await this.productCategoryRepository.subCategoryList(parentId);
  }

  async addProductCategory(
    data: ProductCategoryInput,
  ): Promise<ProductCategoryPayload> {
    return await this.productCategoryRepository.addProductCategory(data);
  }
  async updateProductCategory(
    data: ProductCategoryInput,
    id: string,
  ): Promise<ProductCategoryPayload> {
    const category = await this.productCategoryRepository.getCategoryById(id);

    if (!category)
      return customError(
        PRODUCT_CATEGORY_MESSAGE.NOT_FOUND,
        PRODUCT_CATEGORY_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    return await this.productCategoryRepository.updateProductCategory(
      data,
      id,
      category,
    );
  }
  async deleteProductCategory(id: string): Promise<ProductCategoryPayload> {
    const category = await this.productCategoryRepository.getCategoryById(id);

    if (!category)
      return customError(
        PRODUCT_CATEGORY_MESSAGE.NOT_FOUND,
        PRODUCT_CATEGORY_CODE.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    return await this.productCategoryRepository.deleteProductCategory(id);
  }
}
