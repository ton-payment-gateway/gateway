import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({
    type: String,
    description: 'Address metadata',
  })
  metadata: string;
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
