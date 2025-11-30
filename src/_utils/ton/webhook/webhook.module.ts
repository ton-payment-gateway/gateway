import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import configuration from 'src/_core/config/configuration';

const config = configuration();

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: async () => ({
        baseURL: config.ton.webhook.apiUrl,
        timeout: 100000,
        maxRedirects: 10,
        headers: {
          Authorization: `Bearer ${config.ton.webhook.apiKey}`,
        },
      }),
    }),
  ],
  exports: [WebhookService],
  providers: [WebhookService],
})
export class WebhookModule {}
