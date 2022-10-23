import { Injectable, Scope } from '@nestjs/common';
import * as DataLoader from 'dataloader';

import { PostsRepository } from '../post/repository/post.repository';
import { UserService } from '../user/services/user.service';

import { CommentsRepository } from './repository/comment.repository';

import type { Post } from '../post/post.models';
import type { User } from '../user/entities/user.entity';
import type { Comment } from './comment.models';

@Injectable({ scope: Scope.REQUEST })
export default class CommentsLoader {
  public readonly batchCreators = new DataLoader<User['id'], User>(
    async (keys: readonly string[]) => this.userService.findUsersByIds(keys),
  );

  public readonly batchRepliedTo = new DataLoader<Comment['id'], Comment>(
    async (keys: readonly string[]) =>
      this.commentsRepository.findCommentsByIds(keys),
  );

  public readonly batchPosts = new DataLoader<Post['id'], Post>(
    async (keys: readonly string[]) =>
      this.postsRepository.findPostsByIds(keys),
  );

  public constructor(
    private readonly userService: UserService,
    private readonly commentsRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository,
  ) {}
}
