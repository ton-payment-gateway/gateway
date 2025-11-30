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
      admin: {
        username: process.env.APP_AUTH_ADMIN_USERNAME,
        password: process.env.APP_AUTH_ADMIN_PASSWORD,
        access: {
          secret: process.env.APP_AUTH_ADMIN_ACCESS_SECRET,
          ttl: process.env.APP_AUTH_ADMIN_ACCESS_EXPIRATION_TIME,
        },
        refresh: {
          secret: process.env.APP_AUTH_ADMIN_REFRESH_SECRET,
          ttl: process.env.APP_AUTH_ADMIN_REFRESH_EXPIRATION_TIME,
        },
      },
    },
    encryption: {
      iv: process.env.APP_ENCRYPTION_IV,
      key: process.env.APP_ENCRYPTION_KEY,
    },
    ton: {
      blockchain: {
        apiUrl: 'https://tonapi.io',
        apiKey: process.env.APP_TON_API_KEY,
      },
      webhook: {
        apiUrl: 'https://rt.tonapi.io',
        apiKey: process.env.APP_TON_API_KEY,
      },
      client: {
        rpc: 'https://toncenter.com/api/v2/jsonRPC',
        rpcApiKey: process.env.APP_TON_RPC_API_KEY,
      },
      walletAddress: process.env.APP_TON_WALLET_ADDRESS,
    },
    forecast: {
      url: process.env.APP_FORECAST_URL,
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
  APP_AUTH_ADMIN_USERNAME: Joi.string().required(),
  APP_AUTH_ADMIN_PASSWORD: Joi.string().required(),
  APP_AUTH_ADMIN_ACCESS_SECRET: Joi.string().required(),
  APP_AUTH_ADMIN_ACCESS_EXPIRATION_TIME: Joi.string().required(),
  APP_AUTH_ADMIN_REFRESH_SECRET: Joi.string().required(),
  APP_AUTH_ADMIN_REFRESH_EXPIRATION_TIME: Joi.string().required(),

  // ENCRYPTION
  APP_ENCRYPTION_IV: Joi.string().required(),
  APP_ENCRYPTION_KEY: Joi.string().required(),

  // TON
  APP_TON_API_KEY: Joi.string().required(),
  APP_TON_RPC_API_KEY: Joi.string().required(),
  APP_TON_WALLET_ADDRESS: Joi.string().required(),

  // FORECAST
  APP_FORECAST_URL: Joi.string().required(),
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
