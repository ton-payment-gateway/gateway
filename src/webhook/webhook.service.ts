import { Injectable } from '@nestjs/common';
import { WebhookDto } from './dto/webhook.dto';

@Injectable()
export class WebhookService {
  async receiveNotification(body: WebhookDto) {
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
