import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Roles } from 'src/modules/auth/decorators/role.decorator';
import { Role } from 'src/modules/auth/enum/role.enum';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import { ProductCategory } from '../entities/product-category.entity';
import { ProductCategoryService } from '../services/product-category.service';
import { ProductCategoryRepository } from '../repository/product-category.repository';
import { ProductCategoryPayload } from '../entities/product-category.payload';
import { ProductCategoryInput } from '../dto/product-category.input';
import { ProductCategoryLoader } from '../product-category.loader';

@Resolver(() => ProductCategory)
export class ProductCategoryResolver {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
    private readonly productCategoryLoader: ProductCategoryLoader,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [ProductCategory])
  async productCategories(): Promise<ProductCategory[]> {
    return this.productCategoryService.getProductCategories();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [ProductCategory])
  async rootCategory(): Promise<ProductCategory[]> {
    return await this.productCategoryService.rootProductCategory();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [ProductCategory])
  async subCategoryList(
    @Args('parentId') parentId: string,
  ): Promise<ProductCategory[]> {
    return await this.productCategoryService.subCategoryList(parentId);
  }

  @UseGuards(GqlAuthGuard)
  @Roles(Role.Admin)
  @Mutation(() => ProductCategoryPayload)
  async productCategory(
    @Args('input') input: ProductCategoryInput,
  ): Promise<ProductCategoryPayload> {
    return await this.productCategoryService.addProductCategory(input);
  }

  @UseGuards(GqlAuthGuard)
  @Roles(Role.Admin)
  @Mutation(() => ProductCategoryPayload)
  async updateProductCategory(
    @Args('input') input: ProductCategoryInput,
    @Args('id') id: string,
  ): Promise<ProductCategoryPayload> {
    return await this.productCategoryService.updateProductCategory(input, id);
  }
  @UseGuards(GqlAuthGuard)
  @Roles(Role.Admin)
  @Mutation(() => ProductCategoryPayload)
  async deleteProductCategory(
    @Args('id') id: string,
  ): Promise<ProductCategoryPayload> {
    return await this.productCategoryService.deleteProductCategory(id);
  }

  @ResolveField('subCategory', () => [ProductCategory], { nullable: true })
  async subCategory(
    @Parent() category: ProductCategory,
  ): Promise<ProductCategory[] | null> {
    const { id } = category;
    console.log(id, 'incoming id ');
    if (!id) return null;
    return await this.productCategoryLoader.subCategoryLoader.load(id);
  }
  // @ResolveField('category', () => ProductCategory, { nullable: true })
  // async category(
  //   @Parent() category: ProductCategory,
  // ): Promise<ProductCategory | null> {
  //   const { categoryId } = category;
  //   if (!categoryId) return null;
  //   return await this.productCategoryLoader.categoryLoader.load(categoryId);
  // }
}
