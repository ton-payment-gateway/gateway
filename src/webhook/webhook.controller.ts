import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';

import { ROUTER } from 'src/_core/router';
import { ResExceptionDto } from 'src/_core/exception/dto/exception.dto';
import { WebhookService } from './webhook.service';
import { WebhookDto } from './dto/webhook.dto';

@ApiResponse({
  status: 400,
  description: 'Error',
  type: ResExceptionDto,
})
@ApiResponse({
  status: 422,
  description: 'Validate error',
  type: ResExceptionDto,
})
@Controller()
@ApiTags('Webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post(ROUTER.WEBHOOK)
  @ApiOperation({ summary: 'Receive notification from Ton' })
  receiveNotification(@Body() body: WebhookDto) {
    return this.webhookService.receiveNotification(body);
  }
}
