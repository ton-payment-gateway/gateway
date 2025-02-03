import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { SortEnum } from '../types';
import { Type } from 'class-transformer';

export class PaginationDto {
  @Min(1)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    default: 1,
    required: false,
    description: 'Page',
  })
  page?: number;

  @Min(1)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    default: 20,
    required: false,
    description: 'Limit',
  })
  limit?: number;

  @IsOptional()
  @IsEnum(SortEnum)
  @ApiProperty({
    enum: SortEnum,
    default: 'desc',
    required: false,
    description: 'Sort type',
  })
  sort?: SortEnum;
}

export class ResPaginationDto {
  @ApiProperty({
    description: 'Current page',
  })
  page: number;

  @ApiProperty({
    description: 'Total number of items',
  })
  total: number;
}
