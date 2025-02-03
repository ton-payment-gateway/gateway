export interface ApplicationConfigurations {
  database: {
    url: string;
    schema: string;
    password: string;
  };
  app: {
    tz: string;
    url: string;
    env: string;
    port: number;
    cors: string;
    isActiveSwagger: boolean;
  };
  auth: {
    accessSecret: string;
    accessTtl: string;
    refreshSecret: string;
    refreshTtl: string;
  };
  encryption: {
    iv: string;
    key: string;
  };
  sentry: {
    dns: string;
    isEnable: boolean;
    rate: number;
  };
  [property: string]: any;
}
