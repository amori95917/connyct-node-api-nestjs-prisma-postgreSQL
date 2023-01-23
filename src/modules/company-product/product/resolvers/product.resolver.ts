import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Product } from '../entities/product.entity';
import { ProductService } from '../services/product.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import {
  ProductAttributeInput,
  ProductMediaInput,
  ProductInput,
  ProductVariationInput,
  ProductEditInput,
  ProductMediaEditInput,
  ProductTypeInput,
  ProductTypeEditInput,
} from '../dto/product.input';
import { User } from 'src/modules/user/entities/user.entity';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import {
  FindProductPayload,
  ProductAttributePayload,
  ProductMediaPayload,
  ProductMediaUpdatePayload,
  ProductPayload,
  ProductVariationPayload,
} from '../entities/product.payload';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { OrderListProduct } from '../dto/order-product.input';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { ProductMedia } from '../entities/product-media.entity';
import { ProductLoader } from '../product.loader';
import { ProductCategory } from '../../product-category/entities/product-category.entity';
import { ProductCategoryRepository } from '../../product-category/repository/product-category.repository';
import { ProductType } from '../entities/product-type.entity';

@Resolver(() => Product)
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly productLoader: ProductLoader,
    private readonly productCategoryRepository: ProductCategoryRepository,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => FindProductPayload)
  async productFindAll(
    @Args('companyId') companyId: string,
    @Args() paginate: ConnectionArgs,
    @Args('order', {
      nullable: true,
      defaultValue: { orderBy: 'createdAt', direction: 'desc' },
    })
    order: OrderListProduct,
  ): Promise<FindProductPayload> {
    return await this.productService.findProduct(companyId, paginate, order);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProductPayload)
  async product(
    @Args('productType') productType: ProductTypeInput,
    @Args('product') product: ProductInput,
    @Args('companyId') companyId: string,
    @Args('media', { type: () => [GraphQLUpload], nullable: true })
    media: FileUpload[],
    @Args('mediaType', { nullable: true }) mediaType: ProductMediaInput,
    @CurrentUser() user: User,
  ): Promise<ProductPayload> {
    return await this.productService.product(
      productType,
      product,
      companyId,
      user.id,
      media,
      mediaType,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProductPayload)
  async productEditAll(
    @Args('productTypeId', { nullable: true }) productTypeId: string,
    @Args('productType') productType: ProductTypeEditInput,
    @Args('productId') productId: string,
    @Args('product') product: ProductEditInput,
    @Args('image', { type: () => GraphQLUpload, nullable: true })
    media: FileUpload,
    @Args('mediaId', { nullable: true }) mediaId: string,
    @Args('mediaType', { nullable: true }) mediaType: ProductMediaInput,
  ): Promise<ProductPayload> {
    return await this.productService.productEditAll(
      productTypeId,
      productType,
      productId,
      product,
      media,
      mediaId,
      mediaType,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProductPayload)
  async productCreate(
    @Args('input') input: ProductInput,
    @Args('companyId') companyId: string,
    @CurrentUser() user: User,
  ): Promise<ProductPayload> {
    return await this.productService.productCreate(input, companyId, user.id);
  }
  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProductPayload)
  async productEdit(
    @Args('productId') productId: string,
    @Args('input') input: ProductEditInput,
  ): Promise<ProductPayload> {
    return await this.productService.productEdit(productId, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProductMediaPayload)
  async productMediaCreate(
    @Args('productId') productId: string,
    @Args('mediaType') mediaType: ProductMediaInput,
    @Args('media', { type: () => [GraphQLUpload] }) media: FileUpload[],
  ): Promise<ProductMediaPayload> {
    return await this.productService.productMediaCreate(
      productId,
      media,
      mediaType,
    );
  }
  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProductMediaUpdatePayload)
  async productMediaEdit(
    @Args('mediaId') mediaId: string,
    @Args('media', { type: () => GraphQLUpload, nullable: true })
    media: FileUpload,
    mediaType: ProductMediaEditInput,
  ): Promise<ProductMediaUpdatePayload> {
    return await this.productService.productMediaEdit(
      mediaId,
      media,
      mediaType,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProductAttributePayload)
  async productAttributeCreate(
    @Args('input') input: ProductAttributeInput,
  ): Promise<ProductAttributePayload> {
    return await this.productService.productAttributeCreate(input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProductVariationPayload)
  async productVariationCreate(
    @Args('input') input: ProductVariationInput,
  ): Promise<ProductVariationPayload> {
    return await this.productService.productVariationCreate(input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProductType)
  async productType(
    @Args('input') input: ProductTypeInput,
  ): Promise<ProductType> {
    return await this.productService.productType(input);
  }
  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProductType)
  async productTypeEdit(
    @Args('id') id: string,
    @Args('input') input: ProductTypeEditInput,
  ): Promise<ProductType> {
    return await this.productService.productTypeEdit(id, input);
  }

  @ResolveField('productMedia', () => [ProductMedia])
  async productMedia(@Parent() product: Product): Promise<ProductMedia[]> {
    const { id } = product;
    return await this.productLoader.productMediaLoader.load(id);
  }
  @ResolveField('category', () => ProductCategory)
  async category(@Parent() product: Product): Promise<ProductCategory> {
    const { categoryId } = product;
    return await this.productCategoryRepository.getCategoryById(categoryId);
  }
}
