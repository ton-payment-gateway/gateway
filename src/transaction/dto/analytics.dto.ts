import { ApiProperty } from '@nestjs/swagger';

export class GMVDto {
  @ApiProperty({
    type: String,
    description: 'Date',
  })
  date: string;

  @ApiProperty({
    type: Number,
    description: 'Gross Market Value',
  })
  gmv: number;
}

export class ServiceFeeDto {
  @ApiProperty({
    type: String,
    description: 'Date',
  })
  date: string;

  @ApiProperty({
    type: Number,
    description: 'Service Fee',
  })
  serviceFee: number;
}

export class CRDto {
  @ApiProperty({
    type: String,
    description: 'Date',
  })
  date: string;

  @ApiProperty({
    type: Number,
    description: 'Conversion Rate',
  })
  conversionRate: number;
}

export class AverageConfirmationTimeDto {
  @ApiProperty({
    type: String,
    description: 'Date',
  })
  date: string;

  @ApiProperty({
    type: Number,
    description: 'Average Confirmation Time in seconds',
  })
  averageConfirmationTime: number;
}

export class P95ConfirmationTimeDto {
  @ApiProperty({
    type: String,
    description: 'Date',
  })
  date: string;

  @ApiProperty({
    type: Number,
    description: 'P95 Confirmation Time in milliseconds',
  })
  p95ConfirmationTime: number;
}

export class DirectDepositShareDto {
  @ApiProperty({
    type: String,
    description: 'Date',
  })
  date: string;

  @ApiProperty({
    type: Number,
    description: 'Direct Deposit Share in percentage',
  })
  directDepositShare: number;
}

export class AverageOrderValueDto {
  @ApiProperty({
    type: String,
    description: 'Date',
  })
  date: string;

  @ApiProperty({
    type: Number,
    description: 'Average Order Value',
  })
  averageOrderValue: number;
}

export class RepeatCustomerRateDto {
  @ApiProperty({
    type: String,
    description: 'Date',
  })
  date: string;

  @ApiProperty({
    type: Number,
    description: 'Repeat Customer Rate in percentage',
  })
  repeatCustomerRate: number;
}

export class FunnelChartDto {
  @ApiProperty({
    type: Number,
    description: 'Total Transactions',
  })
  totalTransactions: number;

  @ApiProperty({
    type: Number,
    description: 'Completed Transactions',
  })
  completedTransactions: number;

  @ApiProperty({
    type: Number,
    description: 'Failed Transactions',
  })
  failedTransactions: number;

  @ApiProperty({
    type: Number,
    description: 'CR Rate in percentage',
  })
  crRate: number;
}

export class HourlyHeatmapDto {
  @ApiProperty({
    type: Number,
    description: 'Hour of the day (0-23)',
  })
  hour: number;

  @ApiProperty({
    type: Number,
    description: 'Day of the week (0-6, where 0 is Sunday)',
  })
  day: number;

  @ApiProperty({
    type: Number,
    description: 'Number of Transactions',
  })
  count: number;
}

export class FailuresShareDto {
  @ApiProperty({
    type: String,
    description: 'Date',
  })
  date: string;

  @ApiProperty({
    type: Number,
    description: 'Failure Share in percentage',
  })
  failureShare: number;
}

export class GMVForecastDataDto {
  @ApiProperty({
    type: String,
    description: 'Date',
  })
  date: string;

  @ApiProperty({
    type: Number,
    description: 'Forecasted Gross Market Value',
  })
  forecastGmv: number;
}

export class GMVForecastDto {
  @ApiProperty({
    type: GMVDto,
    isArray: true,
    description: 'Historical GMV Data',
  })
  historical: GMVDto[];

  @ApiProperty({
    type: GMVForecastDataDto,
    isArray: true,
    description: 'Forecasted GMV Data',
  })
  forecast: GMVForecastDataDto[];
}

export class MerchantClusteringDto {
  @ApiProperty({
    type: String,
    description: 'Merchant ID',
  })
  merchantId: any;

  @ApiProperty({
    type: Number,
    description: 'Average Order Value',
  })
  aov: number;

  @ApiProperty({
    type: Number,
    description: 'Conversion Rate',
  })
  cr: number;

  @ApiProperty({
    type: Number,
    description: 'Direct Deposit Share in percentage',
  })
  directDepositShare: number;

  @ApiProperty({
    type: Number,
    description: 'Average Confirmation Time in seconds',
  })
  avgConfirmTime: number;

  @ApiProperty({
    type: Number,
    description: 'Cluster ID',
  })
  cluster: number;
}

export class ActiveMerchantsDto {
  @ApiProperty({
    type: String,
    description: 'Date',
  })
  date: string;

  @ApiProperty({
    type: Number,
    description: 'Number of Active Merchants',
  })
  activeMerchants: number;
}

export class NewMerchantsCohortDto {
  @ApiProperty({
    type: String,
    description: 'Cohort Month',
  })
  cohortMonth: string;

  @ApiProperty({
    type: Number,
    description: 'Month Offset from Cohort Month',
  })
  monthOffset: number;

  @ApiProperty({
    type: Number,
    description: 'Number of Active Merchants',
  })
  activeMerchants: number;
}

export class MerchantRetentionDto {
  @ApiProperty({
    type: String,
    description: 'Cohort Month',
  })
  cohortMonth: string;

  @ApiProperty({
    type: Number,
    description: 'Month Offset from Cohort Month',
  })
  monthOffset: number;

  @ApiProperty({
    type: Number,
    description: 'Retention Rate in percentage',
  })
  retentionRate: number;

  @ApiProperty({
    type: Number,
    description: 'Number of Retained Merchants',
  })
  retainedMerchants: number;

  @ApiProperty({
    type: Number,
    description: 'Total Merchants in Cohort',
  })
  totalMerchantsInCohort: number;
}

export class HotspotsDto {
  @ApiProperty({
    type: String,
    description: 'Merchant ID',
  })
  merchantId: any;

  @ApiProperty({
    type: Number,
    description: 'Conversion Rate',
  })
  cr: number;

  @ApiProperty({
    type: Number,
    description: 'Failure Share in percentage',
  })
  failureShare: number;

  @ApiProperty({
    type: Number,
    description: 'Total Transactions',
  })
  totalTransactions: number;
}
