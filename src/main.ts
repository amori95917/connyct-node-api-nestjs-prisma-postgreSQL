import * as dotenv from 'dotenv';
import type { NestExpressApplication } from '@nestjs/platform-express';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { CorsConfig, NestConfig } from './config/config.interface';

import { AppModule } from './app.module';
import { verify } from 'crypto';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        console.log('validation error', validationErrors);
        return new BadRequestException(validationErrors);
      },
      transform: true,
    }),
  );
  if (corsConfig.enabled) {
    const corsOptions = {
      // allowedHeaders: [
      //   'origin',
      //   'x-requested-with',
      //   'content-type',
      //   'accept',
      //   'authorization',
      // ],
      credentials: true,
      origin: '*',
    };
    app.enableCors(corsOptions);
  }
  await app.listen(nestConfig.port);
}
bootstrap();
