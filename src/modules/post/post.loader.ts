import { Injectable, Scope } from '@nestjs/common';
import * as DataLoader from 'dataloader';

import { UserService } from '../user/services/user.service';

import type { User } from '../user/entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
export default class PostsLoaders {
  public readonly batchCreators = new DataLoader<User['id'], User>(
    async (keys: readonly string[]) => this.userService.findUsersByIds(keys),
  );

  public constructor(private readonly userService: UserService) {}
}
