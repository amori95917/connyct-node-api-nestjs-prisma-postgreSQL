import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ProductCategory } from '../entities/product-category.entity';
import { ProductCategoryInput } from '../dto/product-category.input';
import {
  ProductCategoryDeletePayload,
  ProductCategoryPayload,
} from '../entities/product-category.payload';

@Injectable()
export class ProductCategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getCategoryById(
    id: string | undefined,
  ): Promise<ProductCategory | null> {
    try {
      if (!id) return null;
      const category = await this.prisma.productCategory.findFirst({
        where: { id },
      });
      return category;
    } catch (err) {
      throw new Error(err);
    }
  }
  async findSubCategoryByIds(ids: string[]) {
    return await this.prisma.productCategory.findMany({
      where: {
        parentId: {
          in: ids,
        },
      },
    });
  }
  async findCategoryByIds(ids: string[]) {
    return await this.prisma.productCategory.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
  async getCategoryByIdCategoryId(
    id: string | undefined,
  ): Promise<ProductCategory[] | null> {
    try {
      if (!id) return null;
      const category = await this.prisma.productCategory.findMany({
        where: { parentId: id },
      });
      return category;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getProductCategories(): Promise<ProductCategory[]> {
    try {
      const categories = await this.prisma.productCategory.findMany({
        where: { parentId: null },
      });
      return categories;
    } catch (err) {
      throw new Error(err);
    }
  }

  async rootProductCategory(): Promise<ProductCategory[]> {
    try {
      const categories = await this.prisma.productCategory.findMany({
        where: { parentId: null, level: 1 },
      });
      return categories;
    } catch (err) {
      throw new Error(err);
    }
  }

  async subCategoryList(parentId: string): Promise<ProductCategory[]> {
    try {
      const categories = await this.prisma.productCategory.findMany({
        where: { parentId },
      });
      return categories;
    } catch (err) {
      throw new Error(err);
    }
  }

  async calculateCategoryLevel(id: string): Promise<number> {
    try {
      const categoryLevel = await this.prisma.productCategory.findFirst({
        where: {
          id,
        },
      });
      return categoryLevel.level + 1;
    } catch (err) {
      throw new Error(err);
    }
  }

  async addProductCategory(
    data: ProductCategoryInput,
  ): Promise<ProductCategoryPayload> {
    try {
      const category = await this.prisma.productCategory.create({
        data: {
          ...data,
          level: data.isRoot
            ? 1
            : await this.calculateCategoryLevel(data.parentId),
        },
      });
      return {
        data: category,
      };
    } catch (err) {
      throw new Error(err);
    }
  }
  async updateProductCategory(
    data: ProductCategoryInput,
    id: string,
    category,
  ): Promise<ProductCategoryPayload> {
    try {
      const updateCategory = await this.prisma.productCategory.update({
        where: { id },
        data: { ...category, data },
      });
      return {
        data: updateCategory,
      };
    } catch (err) {
      throw new Error(err);
    }
  }
  async deleteProductCategory(
    id: string,
  ): Promise<ProductCategoryDeletePayload> {
    try {
      await this.prisma.productCategory.delete({
        where: { id },
      });
      return {
        isDeleted: true,
      };
    } catch (err) {
      throw new Error(err);
    }
  }
}
