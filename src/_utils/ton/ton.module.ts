import { BlockchainModule } from './blockchain/blockchain.module';
import { ClientModule } from './client/client.module';
import { Module } from '@nestjs/common';
import { TonService } from './ton.service';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [BlockchainModule, ClientModule, WebhookModule],
  exports: [TonService],
  providers: [TonService],
})
export class TonModule {}
