import { Global, Module } from '@nestjs/common';
import { BaseLogger } from './base-logger/base-logger';

@Global()
@Module({
  providers: [BaseLogger],
  exports: [BaseLogger],
})
export class LoggerModule {}
