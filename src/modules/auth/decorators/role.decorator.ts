import { SetMetadata } from '@nestjs/common';

import { Role } from 'src/modules/auth/enum/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => {
  const role = SetMetadata(ROLES_KEY, roles);
  return role;
};
