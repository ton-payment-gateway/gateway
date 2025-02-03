import { name, version } from '../../package.json';

import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { DocumentBuilder } from '@nestjs/swagger';
import configuration from './config/configuration';

const config = configuration();

export const swaggerConfig = () => {
  const doc = new DocumentBuilder()
    .setTitle(name)
    .setVersion(version)
    .setDescription(`This is the ${name} project documentation`)
    .addBearerAuth({
      type: 'http',
      scheme: 'Bearer',
      bearerFormat: 'JWT',
      description:
        'Add value like: "Bearer <access_token>", Name: "Authorization", In: header',
    });

  return doc.build();
};

export const enableCorsUrls = () => {
  const corsWhileList = config.app.cors;

  if (!corsWhileList) {
    return '*';
  }

  const cors = corsWhileList.split(',').map((i) => {
    const url = i.trim().replace('*', '.+\\');
    return new RegExp(url);
  });

  return cors;
};

export const corsOptionsDelegate: unknown = (
  req: Request,
  callback: (err: Error, options: CorsOptions) => void,
) => {
  const corsOptions: CorsOptions = {
    credentials: true,
    origin: enableCorsUrls(),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  };

  const error: Error | null = null;

  callback(error, corsOptions);
};
