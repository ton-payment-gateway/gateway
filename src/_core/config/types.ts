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
    admin: {
      username: string;
      password: string;
      access: {
        secret: string;
        ttl: string;
      };
      refresh: {
        secret: string;
        ttl: string;
      };
    };
  };
  encryption: {
    iv: string;
    key: string;
  };
  ton: {
    blockchain: {
      apiUrl: string;
      apiKey: string;
    };
    webhook: {
      apiUrl: string;
      apiKey: string;
    };
    client: {
      rpc: string;
      rpcApiKey: string;
    };
    walletAddress: string;
  };
  forecast: {
    url: string;
  };
  sentry: {
    dns: string;
    isEnable: boolean;
    rate: number;
  };
  [property: string]: any;
}
