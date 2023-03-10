import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
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
import {
  FindProductPayload,
  ProductAttributePayload,
  ProductMediaPayload,
  ProductMediaUpdatePayload,
  ProductPayload,
  ProductVariationPayload,
} from '../entities/product.payload';
import { FileUpload } from 'graphql-upload';
import { FileUploadService } from 'src/modules/files/services/file.service';
import { CloudinaryService } from 'src/modules/cloudinary/services/cloudinary.service';
import { OrderListProduct } from '../dto/order-product.input';
import ConnectionArgs from 'src/modules/prisma/resolvers/pagination/connection.args';
import { findManyCursorConnection } from 'src/modules/prisma/resolvers/pagination/relay.pagination';
import { ApolloError } from 'apollo-server-express';
import { PRODUCT_MESSAGE } from 'src/common/errors/error.message';
import { PRODUCT_CODE } from 'src/common/errors/error.code';
import { STATUS_CODE } from 'src/common/errors/error.statusCode';
import { ProductType } from '../entities/product-type.entity';

@Injectable()
export class ProductRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUploadService: FileUploadService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async findProductMediaByIds(ids: string[]) {
    return await this.prisma.productMedia.findMany({
      where: {
        productId: { in: ids },
      },
    });
  }

  async findProductById(id: string) {
    return await this.prisma.product.findFirst({ where: { id } });
  }
  async findProduct(
    companyId: string,
    paginate: ConnectionArgs,
    order: OrderListProduct,
  ): Promise<FindProductPayload> {
    try {
      const community = await findManyCursorConnection(
        (args) =>
          this.prisma.product.findMany({
            ...args,
            where: { companyId },
            orderBy: { [order.orderBy]: order.direction },
            include: {
              ProductImage: true,
              ProductAttribute: true,
              ProductVariation: true,
            },
          }),
        () =>
          this.prisma.product.count({
            where: { companyId },
          }),
        { ...paginate },
      );
      return {
        data: community,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async product(
    productType: ProductTypeInput,
    product: ProductInput,
    companyId: string,
    authorId: string,
    media: FileUpload[],
    mediaType: ProductMediaInput,
  ): Promise<ProductPayload> {
    try {
      const productCreate = await this.prisma.$transaction(
        async (prisma) => {
          let productTypeData: ProductType;
          if (productType.name) {
            productTypeData = await this.productType(productType, prisma);
          }
          const productData = await this.productCreate(
            product,
            companyId,
            authorId,
            productTypeData.id,
            prisma,
          );
          let productMedia: any;
          if (media) {
            productMedia = await this.productMediaCreate(
              productData.data.id,
              media,
              mediaType,
              prisma,
            );
          }
          return {
            productData,
            productMedia,
          };
        },
        { maxWait: 5000, timeout: 10000 },
      );
      return {
        data: Object.assign(productCreate.productData.data, {
          productImage: productCreate.productMedia
            ? productCreate.productMedia.data
            : null,
        }),
      };
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
  async productAllEdit(
    productTypeId: string,
    productType: ProductTypeEditInput,
    id: string,
    product: ProductEditInput,
    media: FileUpload,
    mediaId: string,
    mediaType: ProductMediaInput,
  ): Promise<ProductPayload> {
    try {
      const productUpdate = await this.prisma.$transaction(async (prisma) => {
        let productTypeData: ProductType;
        if (productTypeId) {
          productTypeData = await this.productTypeEdit(
            productTypeId,
            productType,
            prisma,
          );
        }
        const productData = await this.productEdit(
          id,
          product,
          productTypeData.id ? productTypeData.id : productTypeId,
          prisma,
        );
        let productMedia: any;
        if (media) {
          productMedia = await this.productMediaEdit(
            mediaId,
            media,
            mediaType,
            prisma,
          );
        }
        return {
          productData,
          productMedia,
        };
      });

      return {
        data: Object.assign(productUpdate.productData.data, {
          productImage: productUpdate.productMedia
            ? productUpdate.productMedia.data
            : null,
        }),
      };
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async productCreate(
    input: ProductInput,
    companyId: string,
    authorId: string,
    productTypeId?: string,
    prisma?: any,
  ): Promise<ProductPayload> {
    try {
      const product = await (prisma ? prisma : this.prisma).product.create({
        data: { ...input, companyId, authorId, productTypeId },
      });
      return {
        data: product,
      };
    } catch (err) {
      throw new Error(err);
    }
  }
  async productEdit(
    id: string,
    input: ProductEditInput,
    productTypeId?: string,
    prisma?: any,
  ): Promise<ProductPayload> {
    try {
      const product = await (prisma ? prisma : this.prisma).product.update({
        where: { id },
        data: { ...input, productTypeId },
      });
      return {
        data: product,
      };
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
    prisma?: any,
  ): Promise<ProductMediaPayload> {
    try {
      const productMediaUrl = await this.fileUploadService.uploadImage(
        'company/product',
        media,
      );
      const productImage = await Promise.all(
        productMediaUrl.map(async (media: string) => {
          return await (prisma ? prisma : this.prisma).productMedia.create({
            data: { productId, mediaUrl: media, ...mediaType },
          });
        }),
      );
      return {
        data: productImage,
      };
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
  async productMediaEdit(
    mediaId: string,
    media: FileUpload,
    mediaType: ProductMediaEditInput,
    prisma?: any,
  ): Promise<ProductMediaUpdatePayload> {
    try {
      const findMedia = await (prisma
        ? prisma
        : this.prisma
      ).productMedia.findFirst({
        where: { id: mediaId },
      });
      if (!findMedia)
        throw new ApolloError(
          PRODUCT_MESSAGE.PRODUCT_MEDIA_NOT_FOUND,
          PRODUCT_CODE.PRODUCT_MEDIA_NOT_FOUND,
          {
            statusCode: STATUS_CODE.NOT_FOUND,
          },
        );
      const getId = await this.cloudinary.getPublicId(findMedia.mediaUrl);
      await this.fileUploadService.deleteImage('company/product', getId);
      const productMediaUrl = await this.fileUploadService.uploadImage(
        'company/product',
        media,
      );
      const productImage = await (prisma
        ? prisma
        : this.prisma
      ).productMedia.update({
        where: { id: mediaId },
        data: { mediaUrl: productMediaUrl, ...mediaType },
      });
      return { data: productImage };
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async productAttributeCreate(
    input: ProductAttributeInput,
  ): Promise<ProductAttributePayload> {
    try {
      // const productAttribute = await this.prisma.productAttribute.create({
      //   data: { ...input },
      // });
      // return {
      //   data: productAttribute,
      // };
      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  async productVariationCreate(
    input: ProductVariationInput,
  ): Promise<ProductVariationPayload> {
    try {
      const productVariation = await this.prisma.productVariation.create({
        data: { ...input },
      });
      return {
        data: productVariation,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async productType(
    input: ProductTypeInput,
    prisma?: any,
  ): Promise<ProductType> {
    try {
      const productType = await (prisma
        ? prisma
        : this.prisma
      ).productType.create({
        data: { ...input },
      });
      return productType;
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async productTypeEdit(
    id: string,
    input: ProductTypeEditInput,
    prisma?: any,
  ): Promise<ProductType> {
    try {
      const updateProductType = await (prisma
        ? prisma
        : this.prisma
      ).productType.update({
        where: { id },
        data: { ...input },
      });
      return updateProductType;
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }
}
