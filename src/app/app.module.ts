import { AppController } from './app.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '../_core/config/config.module';
import { HealthModule } from '../health/health.module';
import { LoggerModule } from '../_core/logger/logger.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '../_core/typeOrm/typeorm.module';
import { WebhookModule } from 'src/webhook/webhook.module';

@Module({
  imports: [
    // CONFIG, LOGGER, DB
    ConfigModule,
    LoggerModule,
    TypeOrmModule,

    // MODULE
    HealthModule,
    AuthModule,
    WebhookModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
