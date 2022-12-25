import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { CommunityPostMedia } from './entities/post/community-post-image.entity';
import { CommunityPostRepository } from './repository/post/community-post.repository';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/services/user.service';
import { Community } from '../company-community/entities/community.entity';
import { CommunityRepository } from '../company-community/repository/community.repository';

@Injectable()
export class CommunityPostLoader {
  constructor(
    private readonly communityPostRepository: CommunityPostRepository,
    private readonly communityRepository: CommunityRepository,
    private readonly userService: UserService,
  ) {}

  /**post loader */
  public communityPostMediaLoader = new DataLoader<
    string,
    CommunityPostMedia[]
  >(async (ids: string[]) => {
    const postMedia = await this.communityPostRepository.postMediaByPostIds(
      ids,
    );
    return ids.map((key) => postMedia.filter((m) => m.communityPostId === key));
  });

  public creatorLoader = new DataLoader<string, User>(async (ids: string[]) => {
    return await this.userService.findUsersByIds(ids);
  });

  public communityLoader = new DataLoader<string, Community>(
    async (ids: string[]) => {
      return await this.communityRepository.findCommunityByIds(ids);
    },
  );

  /**comment loader */
}
