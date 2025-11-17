import { ApiProperty } from '@nestjs/swagger';

export class TransactionDto {
  @ApiProperty({
    type: String,
    description: 'Transaction ID',
  })
  id: string;

  @ApiProperty({
    type: Number,
    description: 'Amount',
  })
  amount: number;

  @ApiProperty({
    type: Number,
    description: 'Service Fee',
  })
  serviceFee: number;

  @ApiProperty({
    type: String,
    description: 'Transaction Hash',
  })
  hash: string;

  @ApiProperty({
    type: Number,
    description: 'Confirmation Time in milliseconds',
  })
  confirmationTime: number;

  @ApiProperty({
    type: String,
    description: 'Merchant ID',
  })
  merchantId: string;

  @ApiProperty({
    type: Date,
    description: 'Creation Date',
  })
  createdAt: Date;
}
