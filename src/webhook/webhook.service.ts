import { BaseLogger } from 'src/_core/logger/base-logger/base-logger';
import { Injectable } from '@nestjs/common';
import { WebhookDto } from './dto/webhook.dto';

@Injectable()
export class WebhookService {
  constructor(private readonly logger: BaseLogger) {}

  async receiveNotification(body: WebhookDto) {
    this.logger.log(body, 'WebhookService.receiveNotification');

    if (body.event_type !== 'account_tx') {
      return {
        status: 'error',
        message: 'Invalid event type',
      };
    }

    return {
      status: 'success',
    };
  }
}
