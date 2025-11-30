import { IsDate, IsEnum, IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import { EForecastModel } from 'src/transaction/types';

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

export class ForecastDto {
  @ApiProperty({
    type: Number,
    description: 'Horizon in days for the forecast',
  })
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  horizon: number;

  @ApiProperty({
    enum: EForecastModel,
    description: 'Forecast model to be used',
  })
  @IsEnum(EForecastModel)
  @IsNotEmpty()
  model: EForecastModel;
}
