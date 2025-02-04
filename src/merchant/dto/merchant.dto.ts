import { ApiProperty } from '@nestjs/swagger';

export class ResMerchantDto {
  @ApiProperty({
    description: 'Id',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Name',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Webhook URL',
    type: String,
  })
  webhookUrl: string;

  @ApiProperty({
    description: 'Merchant balance',
    type: Number,
  })
  balance: number;

  @ApiProperty({
    description: 'Created at',
    type: Date,
  })
  createdAt: Date;
}
