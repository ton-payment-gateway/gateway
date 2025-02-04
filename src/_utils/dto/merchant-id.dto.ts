import { IsNotEmpty, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class MerchantIdDto {
  @ApiProperty({
    description: 'Merchant Id',
    type: String,
  })
  @IsUUID()
  @IsNotEmpty()
  merchantId: string;
}
