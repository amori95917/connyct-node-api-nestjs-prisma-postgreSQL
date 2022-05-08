import { BaseEntity } from '../common/base.entity';

export class UserEntity extends BaseEntity {
  public firstNme: string;
  public lastName: string;
  public email: string;
  public username: string;
  public password: string;
  public isActive: boolean;
  public isSuperuser: boolean;
}

export class Role extends BaseEntity {
  public name: string;
}

export class Right extends BaseEntity {
  public name: string;
}
