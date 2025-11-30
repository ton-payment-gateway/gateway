import { AddressModule } from 'src/address/address.module';
import { HttpModule } from '@nestjs/axios';
import { MerchantModule } from 'src/merchant/merchant.module';
import { Module } from '@nestjs/common';
import { TonModule } from 'src/_utils/ton/ton.module';
import { TransactionModule } from 'src/transaction/transaction.module';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

@Module({
  imports: [
    TransactionModule,
    MerchantModule,
    AddressModule,
    TonModule,
    HttpModule.registerAsync({
      useFactory: async () => ({
        timeout: 100000,
        maxRedirects: 10,
      }),
    }),
  ],
  controllers: [WebhookController],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WebhookModule {}
