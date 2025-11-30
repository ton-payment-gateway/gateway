import {
  BaseExceptionFilter,
  HttpAdapterHost,
  NestFactory,
  Reflector,
} from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { corsOptionsDelegate, swaggerConfig } from './_core/common';
import { init, setupNestErrorHandler } from '@sentry/nestjs';

import { AppModule } from './app/app.module';
import { BaseLogger } from './_core/logger/base-logger/base-logger';
import { GlobalExceptionFilter } from './_core/exception/global.exception';
import { ROUTER } from './_core/router';
import { SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './_utils/interceptors/response.interceptor';
import { ValidationPipeOptions } from './_core/pipe/validation.pipe';
import configuration from './_core/config/configuration';

const config = configuration();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Config cors
  app.enableCors(corsOptionsDelegate);

  // Global validate data
  app.useGlobalPipes(new ValidationPipe(ValidationPipeOptions));

  // Global logger
  app.useLogger(app.get(BaseLogger));

  // Global interceptors
  app.useGlobalInterceptors(new TransformInterceptor(new Reflector()));

  // Global prefix
  app.setGlobalPrefix(ROUTER.BASE, { exclude: ['', 'ping', 'api/ping'] });

  // Sentry
  if (config.sentry.isEnable) {
    init({
      environment: config.app.env,
      sampleRate: config.sentry.rate,
      dsn: config.sentry.isEnable ? config.sentry.dns : undefined,
    });

    const { httpAdapter } = app.get(HttpAdapterHost);
    setupNestErrorHandler(app, new BaseExceptionFilter(httpAdapter));
  }

  // Global сatch the error
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Init swagger
  if (config.app.isActiveSwagger) {
    SwaggerModule.setup(
      'api/docs',
      app,
      SwaggerModule.createDocument(app, swaggerConfig()),
    );
  }

  await app.listen(config.app.port);
  Logger.log(`Server running on port: ${config.app.port}`, 'Bootstrap');
}
bootstrap();
