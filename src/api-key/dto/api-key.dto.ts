import { ApiProperty, IntersectionType } from '@nestjs/swagger';

import { IdDto } from 'src/_utils/dto/id.dto';
import { MerchantIdDto } from 'src/_utils/dto/merchant-id.dto';

export class ResApiKeyDto {
  @ApiProperty({
    type: String,
    description: 'API Key ID',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'API Key Name',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'API Key',
  })
  key: string;

  @ApiProperty({
    type: Date,
    description: 'Created At',
  })
  createdAt: Date;
}

export class ApiKeyIdDto extends IntersectionType(MerchantIdDto, IdDto) {}
