import * as dotenv from 'dotenv';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { CorsConfig, NestConfig } from './config/config.interface';

import { AppModule } from './app.module';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');

  app.useGlobalPipes(new ValidationPipe());
  if (corsConfig.enabled) app.enableCors({ origin: '*' });
  await app.listen(nestConfig.port);
}
bootstrap();
