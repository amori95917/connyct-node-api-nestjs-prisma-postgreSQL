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
  fullName?: string;
  username?: string;
  isActive?: boolean;
  isSuperuser?: boolean;
  email?: string;
  password?: string;
  emailToken?: string;
  passwordToken?: string;
  typeEntityId?: number;
  confirm?: boolean;
  isEmailVerified?: boolean;
}): User {
  return {
    id: data?.id || faker.datatype.uuid(),
    email: data?.email || faker.internet.email(),
    fullName: data?.fullName || faker.name.firstName(),
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
    isEmailVerified: false,
    createdAt: new Date(),
    updatedAt: null,
  };
}

export function createUsers(data?: { unit: number; typeEntityId?: number }) {
  return range(data.unit).map(() =>
    createUser({ typeEntityId: data.typeEntityId }),
  );
}
