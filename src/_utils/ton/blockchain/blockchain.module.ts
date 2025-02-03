import { BlockchainService } from './blockchain.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import configuration from 'src/_core/config/configuration';

const config = configuration();

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: async () => ({
        baseURL: config.ton.blockchain.apiUrl,
        timeout: 100000,
        maxRedirects: 10,
        headers: {
          Authorization: `Bearer ${config.ton.blockchain.apiKey}`,
        },
      }),
    }),
  ],
  exports: [BlockchainService],
  providers: [BlockchainService],
})
export class BlockchainModule {}
