import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repository/product.repository';
import {
  ProductAttributeInput,
  ProductMediaInput,
  ProductInput,
  ProductVariationInput,
  ProductMediaEditInput,
  ProductTypeInput,
  ProductEditInput,
  ProductTypeEditInput,
} from '../dto/product.input';
import {
  FindProductPayload,
  ProductAttributePayload,
  ProductMediaPayload,
  ProductMediaUpdatePayload,
  ProductPayload,
  ProductVariationPayload,
} from '../entities/product.payload';
import { CompanyService } from 'src/modules/company/services/company.service';
import { customError } from 'src/common/errors';
import {
  COMPANY_MESSAGE,
  PRODUCT_CATEGORY_MESSAGE,
  PRODUCT_MESSAGE,
} from 'src/common/errors/error.message';
import {
  COMPANY_CODE,
  PRODUCT_CATEGORY_CODE,
  PRODUCT_CODE,
} from 'src/common/errors/error.code';
import { STATUS_CODE } from 'src/common/errors/error.statusCode';
import { FileUpload } from 'graphql-upload';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { OrderListProduct } from '../dto/order-product.input';
import { ApolloError } from 'apollo-server-express';
import { ProductType } from '../entities/product-type.entity';
import { ProductCategoryRepository } from '../../product-category/repository/product-category.repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productCategoryRepository: ProductCategoryRepository,
    private readonly companyService: CompanyService,
  ) {}

  async findProduct(
    companyId: string,
    paginate: ConnectionArgs,
    order: OrderListProduct,
  ): Promise<FindProductPayload> {
    try {
      const company = await this.companyService.getCompanyById(companyId);
      if (!company)
        throw new ApolloError(
          PRODUCT_MESSAGE.NOT_FOUND,
          PRODUCT_CODE.NOT_FOUND,
          {
            statusCode: STATUS_CODE.NOT_FOUND,
          },
        );
      return await this.productRepository.findProduct(
        companyId,
        paginate,
        order,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
  async product(
    productType: ProductTypeInput,
    product: ProductInput,
    companyId: string,
    userId: string,
    media: FileUpload[],
    mediaType: ProductMediaInput,
  ): Promise<ProductPayload> {
    try {
      const company = await this.companyService.getCompanyById(companyId);
      if (!company)
        throw new ApolloError(
          COMPANY_MESSAGE.NOT_FOUND,
          COMPANY_CODE.NOT_FOUND,
          {
            statusCode: STATUS_CODE.NOT_FOUND,
          },
        );
      const category = await this.productCategoryRepository.getCategoryById(
        product.categoryId,
      );
      if (!category)
        throw new ApolloError(
          PRODUCT_CATEGORY_MESSAGE.NOT_FOUND,
          PRODUCT_CATEGORY_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      return await this.productRepository.product(
        productType,
        product,
        companyId,
        userId,
        media,
        mediaType,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
  async productEditAll(
    productTypeId: string,
    productType: ProductTypeEditInput,
    productId: string,
    product: ProductEditInput,
    media: FileUpload,
    mediaId: string,
    mediaType: ProductMediaInput,
  ): Promise<ProductPayload> {
    try {
      const checkProduct = await this.productRepository.findProductById(
        productId,
      );
      if (!checkProduct)
        throw new ApolloError(
          PRODUCT_MESSAGE.NOT_FOUND,
          PRODUCT_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      return await this.productRepository.productAllEdit(
        productTypeId,
        productType,
        productId,
        product,
        media,
        mediaId,
        mediaType,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
  async productCreate(
    input: ProductInput,
    companyId: string,
    userId: string,
  ): Promise<ProductPayload> {
    try {
      const company = await this.companyService.getCompanyById(companyId);
      if (!company)
        throw new ApolloError(
          COMPANY_MESSAGE.NOT_FOUND,
          COMPANY_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      const category = await this.productCategoryRepository.getCategoryById(
        input.categoryId,
      );
      if (!category)
        throw new ApolloError(
          PRODUCT_CATEGORY_MESSAGE.NOT_FOUND,
          PRODUCT_CATEGORY_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      return await this.productRepository.productCreate(
        input,
        companyId,
        userId,
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
  async productEdit(
    productId: string,
    input: ProductInput,
  ): Promise<ProductPayload> {
    try {
      const product = await this.productRepository.findProductById(productId);
      if (!product)
        throw new ApolloError(
          PRODUCT_MESSAGE.NOT_FOUND,
          PRODUCT_CODE.NOT_FOUND,
          { statusCode: STATUS_CODE.NOT_FOUND },
        );
      return await this.productRepository.productEdit(productId, input);
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
  async productMediaCreate(
    productId: string,
    media: FileUpload[],
    mediaType: ProductMediaInput,
  ): Promise<ProductMediaPayload> {
    return await this.productRepository.productMediaCreate(
      productId,
      media,
      mediaType,
    );
  }
  async productMediaEdit(
    mediaId: string,
    media: FileUpload,
    mediaType: ProductMediaEditInput,
  ): Promise<ProductMediaUpdatePayload> {
    return await this.productRepository.productMediaEdit(
      mediaId,
      media,
      mediaType,
    );
  }
  async productAttributeCreate(
    input: ProductAttributeInput,
  ): Promise<ProductAttributePayload> {
    return await this.productRepository.productAttributeCreate(input);
  }
  async productVariationCreate(
    input: ProductVariationInput,
  ): Promise<ProductVariationPayload> {
    return await this.productRepository.productVariationCreate(input);
  }

  async productType(input: ProductTypeInput): Promise<ProductType> {
    return await this.productRepository.productType(input);
  }
  async productTypeEdit(
    id: string,
    input: ProductTypeEditInput,
  ): Promise<ProductType> {
    return await this.productRepository.productTypeEdit(id, input);
  }
}
