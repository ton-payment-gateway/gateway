import { Injectable, OnModuleInit } from '@nestjs/common';

import { BaseLogger } from 'src/_core/logger/base-logger/base-logger';
import { HttpService } from '@nestjs/axios';
import { ROUTER } from 'src/_core/router';
import configuration from 'src/_core/config/configuration';

const config = configuration();

@Injectable()
export class WebhookService implements OnModuleInit {
  constructor(
    private readonly logger: BaseLogger,
    private readonly httpService: HttpService,
  ) {}

  private webhookId: number;

  async onModuleInit() {
    await this.checkWebhookId();
  }

  async getWebhooks() {
    const { data } = await this.httpService.axiosRef.get<{
      webhooks: {
        id: number;
        endpoint: string;
      }[];
    }>(`/webhooks`);

    return data.webhooks;
  }

  async checkWebhookId() {
    if (this.webhookId) return;

    const webhookUrl = new URL(
      `${ROUTER.BASE}/${ROUTER.WEBHOOK}`,
      config.app.url.endsWith('/') ? config.app.url : config.app.url + '/',
    ).toString();

    const webhooks = await this.getWebhooks();

    const webhook = webhooks.find((w) => w.endpoint === webhookUrl);

    if (webhook) {
      this.webhookId = webhook.id;
    } else {
      const { data } = await this.httpService.axiosRef.post<{
        webhook_id: number;
      }>(`/webhooks`, {
        endpoint: webhookUrl,
      });

      this.webhookId = data.webhook_id;
    }

    this.logger.log('TON webhook found!');
  }

  async subscribeToWallet(walletId: string) {
    await this.httpService.axiosRef.post(
      `/webhooks/${this.webhookId}/account-tx/subscribe `,
      {
        accounts: [
          {
            account_id: walletId,
          },
        ],
      },
    );

    this.logger.log('Subscribed to TON wallet');
  }
}
