import { ApplicationConfigurations } from './types';
import Joi from 'joi';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';

expand(config());

export default (): ApplicationConfigurations => {
  const config = {
    database: {
      url: process.env.APP_DB_URL,
      schema: process.env.APP_DB_SCHEMA,
      password: process.env.APP_DB_PASSWORD,
    },
    app: {
      tz: process.env.TZ,
      env: process.env.APP_ENV,
      port: +process.env.APP_PORT,
      url: process.env.APP_URL,
      cors: process.env.APP_CORS_WHITE_LIST,
      isActiveSwagger: JSON.parse(process.env.APP_FEATURE_SWAGGER),
    },
    auth: {
      accessSecret: process.env.APP_AUTH_ACCESS_SECRET,
      accessTtl: process.env.APP_AUTH_ACCESS_EXPIRATION_TIME,
      refreshSecret: process.env.APP_AUTH_REFRESH_SECRET,
      refreshTtl: process.env.APP_AUTH_REFRESH_EXPIRATION_TIME,
    },
    encryption: {
      iv: process.env.APP_ENCRYPTION_IV,
      key: process.env.APP_ENCRYPTION_KEY,
    },
    sentry: {
      dns: process.env.APP_SENTRY_DSN,
      isEnable: process.env.APP_FEATURE_SENTRY
        ? JSON.parse(process.env.APP_FEATURE_SENTRY)
        : false,
      rate:
        process.env.APP_SENTRY_SAMPLE_RATE &&
        +process.env.APP_SENTRY_SAMPLE_RATE,
    },
  };

  validate(process.env);
  return config;
};

const validSchema = Joi.object({
  // DATABASE
  APP_DB_USER: Joi.string().required(),
  APP_DB_HOST: Joi.string().required(),
  APP_DB_NAME: Joi.string().required(),
  APP_DB_PASSWORD: Joi.string().required(),
  APP_DB_SCHEMA: Joi.string().required(),
  APP_DB_PORT: Joi.number().required(),
  APP_DB_URL: Joi.string().required(),

  // CORE
  TZ: Joi.string().required(),
  APP_URL: Joi.string(),
  APP_ENV: Joi.string(),
  APP_PORT: Joi.number().required(),
  APP_CORS_WHITE_LIST: Joi.string(),
  APP_FEATURE_SWAGGER: Joi.boolean().required(),

  // AUTH
  APP_AUTH_ACCESS_SECRET: Joi.string().required(),
  APP_AUTH_ACCESS_EXPIRATION_TIME: Joi.string().required(),
  APP_AUTH_REFRESH_SECRET: Joi.string().required(),
  APP_AUTH_REFRESH_EXPIRATION_TIME: Joi.string().required(),

  // ENCRYPTION
  APP_ENCRYPTION_IV: Joi.string().required(),
  APP_ENCRYPTION_KEY: Joi.string().required(),
});

const validate = (data: Record<string, unknown>) => {
  const result = validSchema
    .prefs({ errors: { label: 'key' } })
    .validate(data, {
      allowUnknown: true,
    });

  if (result.error) {
    throw new Error(`Config validation error: ${result.error.message}`);
  }
};
