import * as DataLoader from 'dataloader';
import { ProductRepository } from './repository/product.repository';
import { ProductMedia } from './entities/product-media.entity';
import { ApolloError } from 'apollo-server-express';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductLoader {
  constructor(private readonly productRepository: ProductRepository) {}

  public productMediaLoader = new DataLoader<string, ProductMedia[]>(
    async (ids: string[]) => {
      try {
        const productMedia = await this.productRepository.findProductMediaByIds(
          ids,
        );
        return ids.map((key) =>
          productMedia.filter((m) => m.productId === key),
        );
      } catch (err) {
        throw new ApolloError(err);
      }
    },
  );
}
