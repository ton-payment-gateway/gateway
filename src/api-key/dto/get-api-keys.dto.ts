import { ApiProperty } from '@nestjs/swagger';
import { ResApiKeyDto } from './api-key.dto';
import { ResPaginationDto } from 'src/_utils/dto/pagination.dto';

export class ResGetApiKeysDto {
  @ApiProperty({
    description: 'Api Keys',
    type: ResApiKeyDto,
    isArray: true,
  })
  result: ResApiKeyDto[];

  @ApiProperty({
    description: 'Pagination',
    type: ResPaginationDto,
  })
  pagination: ResPaginationDto;
}
