import { config } from 'src/config';

import { User } from '@prisma/client';

import * as bcrypt from 'bcrypt';
import faker from '@faker-js/faker';
import range from 'lodash.range';

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, config().security.bcryptSaltOrRound);
}

export function createUser(data?: {
  id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  isActive?: boolean;
  isSuperuser?: boolean;
  email?: string;
  password?: string;
  emailToken?: string;
  passwordToken?: string;
  typeEntityId?: number;
  confirm?: boolean;
}): User {
  return {
    id: data?.id || faker.datatype.uuid(),
    email: data?.email || faker.internet.email(),
    firstName: data?.firstName || faker.name.firstName(),
    lastName: data?.lastName || faker.name.lastName(),
    username: data?.username,
    password:
      (data?.password && hashPassword(data.password)) ||
      hashPassword(faker.internet.password()),
    emailToken: data?.emailToken || null,
    passwordToken: data?.passwordToken || null,
    confirm: data?.confirm !== undefined ? data.confirm : false,
    isValid: true,
    isActive: true,
    isSuperuser: false,
    createdAt: new Date(),
    updatedAt: null,
  };
}

export function createUsers(data?: { unit: number; typeEntityId?: number }) {
  return range(data.unit).map(() =>
    createUser({ typeEntityId: data.typeEntityId }),
  );
}
