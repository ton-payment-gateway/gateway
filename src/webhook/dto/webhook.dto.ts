import { ApiProperty } from '@nestjs/swagger';

export class WebhookDto {
  @ApiProperty({
    description: 'Event type',
  })
  event_type: 'account_tx';

  @ApiProperty({
    type: String,
    description: 'Account ID',
  })
  account_id: string;

  @ApiProperty({
    type: Number,
    description: 'Amount',
  })
  lt: number;

  @ApiProperty({
    type: String,
    description: 'Transaction ID',
  })
  tx_hash: string;
}
