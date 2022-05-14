import config from 'src/config/config';

import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export const UserIdIsRequired = new BadRequestException(
  '`userId` is required.',
);

export const EmailConflict = new ConflictException('Email already exists.');
export const UserNotFound = new NotFoundException('User not found.');
export const InvalidToken = new UnauthorizedException('Token invalid.');
