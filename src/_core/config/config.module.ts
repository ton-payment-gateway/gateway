import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import configuration from './configuration';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      expandVariables: true,
      load: [configuration],
    }),
  ],
})
export class ConfigModule {}
