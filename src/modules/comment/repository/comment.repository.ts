import { OrderCommentsList } from './../dto/create-comment.input';
import { PaginationArgs } from 'src/modules/prisma/resolvers/pagination/pagination.args';
import { PostsRepository } from './../../post/repository/post.repository';
import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/modules/prisma/prisma.service';
import type { Comment } from '@prisma/client';
import { haveNextPage } from 'src/modules/prisma/resolvers/pagination/pagination';

@Injectable()
export class CommentsRepository {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly postRepository: PostsRepository,
  ) {}

  public async createCommentToPost(
    creatorId: string,
    postId: string,
    text: string,
  ): Promise<Comment> {
    return this.prisma.comment.create({
      data: {
        creatorId,
        postId,
        text,
      },
    });
  }

  public async createCommentToComment(
    creatorId: string,
    commentId: string,
    text: string,
  ): Promise<Comment> {
    return this.prisma.comment.create({
      data: {
        creatorId,
        repliedToId: commentId,
        text,
      },
    });
  }

  public async findCommentsByPostId(postId: string): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: {
        postId,
      },
    });
  }

  public async findRepliesToComment(id: string): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: {
        repliedToId: id,
      },
    });
  }

  public async findCommentsByIds(keys: readonly string[]): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: {
        id: {
          in: [...keys],
        },
      },
    });
  }

  public async incrementRatingById(
    commentId: string,
    incrementRating: number,
  ): Promise<void> {
    await this.prisma.comment.update({
      data: {
        rating: {
          increment: incrementRating,
        },
      },
      where: {
        id: commentId,
      },
    });
  }
  public async getComments(
    postId: string,
    paginate: PaginationArgs,
    order: OrderCommentsList,
  ) {
    try {
      /*check if the post exists */
      const post = await this.postRepository.findPostById(postId);
      if (!post) throw new Error('Post not found');
      /* get comments*/
      const nodes = await this.prisma.comment.findMany({
        where: { postId },
        skip: paginate.skip,
        take: paginate.take,
        orderBy: { [order.orderBy]: order.direction },
      });
      const totalCount = await this.prisma.comment.count({ where: { postId } });
      const hasNextPage = haveNextPage(
        paginate.skip,
        paginate.take,
        totalCount,
      );
      return {
        nodes,
        totalCount,
        hasNextPage,
        edges: nodes?.map((node) => ({
          node,
          cursor: Buffer.from(node.id).toString('base64'),
        })),
      };
    } catch (err) {
      throw new Error(err);
    }
  }
}
