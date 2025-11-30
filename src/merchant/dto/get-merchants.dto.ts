import { ApiProperty } from '@nestjs/swagger';
import { ResMerchantDto } from './merchant.dto';
import { ResPaginationDto } from 'src/_utils/dto/pagination.dto';

export class ResGetMerchantsDto {
  @ApiProperty({
    description: 'Merchants',
    type: ResMerchantDto,
    isArray: true,
  })
  result: ResMerchantDto[];

  @ApiProperty({
    description: 'Pagination',
    type: ResPaginationDto,
  })
  pagination: ResPaginationDto;
}
