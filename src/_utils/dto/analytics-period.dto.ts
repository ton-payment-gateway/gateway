import { IsDate, IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export interface IAnalyticsPeriod {
  startDate: Date;
  endDate: Date;
}

export class AnalyticsPeriodDto implements IAnalyticsPeriod {
  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2025-11-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2025-11-16T00:00:00.000Z',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;
}
