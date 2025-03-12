import { AddressModule } from 'src/address/address.module';
import { ApiKeyModule } from 'src/api-key/api-key.module';
import { AppController } from './app.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '../_core/config/config.module';
import { HealthModule } from '../health/health.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { LoggerModule } from '../_core/logger/logger.module';
import { MerchantModule } from 'src/merchant/merchant.module';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TransactionModule } from 'src/transaction/transaction.module';
import { TypeOrmModule } from '../_core/typeOrm/typeorm.module';
import { UserModule } from 'src/user/user.module';
import { WebhookModule } from 'src/webhook/webhook.module';

@Module({
  imports: [
    // CONFIG, LOGGER, DB
    ConfigModule,
    LoggerModule,
    TypeOrmModule,
    ScheduleModule.forRoot(),

    // MODULE
    JobsModule,
    HealthModule,
    AuthModule,
    UserModule,
    MerchantModule,
    ApiKeyModule,
    AddressModule,
    TransactionModule,
    WebhookModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
