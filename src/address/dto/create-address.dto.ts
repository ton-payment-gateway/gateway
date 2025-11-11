import { IsOptional, IsString, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({
    type: String,
    description: 'Merchant ID',
  })
  @IsUUID()
  @IsOptional()
  merchantId?: string;

  @ApiProperty({
    type: String,
    description: 'Address metadata',
  })
  @IsString()
  @IsOptional()
  metadata?: string;
}

export class ResCreateAddressDto {
  @ApiProperty({
    type: String,
    description: 'Address',
  })
  address: string;

  @ApiProperty({
    type: String,
    description: 'Address metadata',
  })
  metadata: string;
}
