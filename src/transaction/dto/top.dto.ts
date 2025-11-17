import { ApiProperty, IntersectionType } from '@nestjs/swagger';

import { AnalyticsPeriodDto } from 'src/_utils/dto/analytics-period.dto';

export class TopDto {
  @ApiProperty({
    description: 'Top N',
    type: Number,
  })
  top: number;
}

export class TopRequestDto extends IntersectionType(
  TopDto,
  AnalyticsPeriodDto,
) {}
