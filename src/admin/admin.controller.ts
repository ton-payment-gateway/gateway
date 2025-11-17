import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ROUTER } from 'src/_core/router';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResAuthDto } from 'src/auth/dto/auth.dto';
import { ResponseMessage } from 'src/_utils/decorators/response-message.decorator';
import { LoginDto } from './dto/login.dto';
import { ResExceptionDto } from 'src/_core/exception/dto/exception.dto';
import { AdminService } from './admin.service';
import { HttpAuthGuard } from 'src/auth/guards/http-auth.guard';
import { AnalyticsPeriodDto } from 'src/_utils/dto/analytics-period.dto';
import {
  ActiveMerchantsDto,
  AverageConfirmationTimeDto,
  CRDto,
  DirectDepositShareDto,
  FailuresShareDto,
  GMVDto,
  GMVForecastDto,
  HotspotsDto,
  MerchantRetentionDto,
  NewMerchantsCohortDto,
  P95ConfirmationTimeDto,
  ServiceFeeDto,
} from 'src/transaction/dto/analytics.dto';
import { TransactionDto } from 'src/transaction/dto/transaction.dto';
import { TopRequestDto } from 'src/transaction/dto/top.dto';

@ApiResponse({
  status: 400,
  description: 'Error',
  type: ResExceptionDto,
})
@ApiResponse({
  status: 422,
  type: ResExceptionDto,
  description: 'Validate error',
})
@ApiResponse({
  status: 401,
  type: ResExceptionDto,
  description: 'Authorization denied error',
})
@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post(ROUTER.ADMIN.LOGIN)
  @ApiResponse({
    status: 200,
    type: ResAuthDto,
    description: 'Success',
  })
  @ApiOperation({ summary: 'Admin Login' })
  @ResponseMessage('Admin login success')
  async login(@Body() body: LoginDto): Promise<ResAuthDto> {
    return this.adminService.login(body);
  }

  @Post(ROUTER.ADMIN.REFRESH)
  @ApiResponse({
    status: 200,
    type: ResAuthDto,
    description: 'Success',
  })
  @UseGuards(HttpAuthGuard({ isAdmin: true, isRefresh: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin Token Refresh' })
  @ResponseMessage('Admin token refresh success')
  async refresh(): Promise<ResAuthDto> {
    return this.adminService.refresh();
  }

  // Analytics endpoints
  @Get(ROUTER.ADMIN.ANALYTICS.GMV)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: Number,
  })
  @UseGuards(HttpAuthGuard({ isAdmin: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get GMV' })
  @ResponseMessage('Get GMV success')
  async getGmv(@Query() period: AnalyticsPeriodDto): Promise<number> {
    return this.adminService.callTransactionServiceMethod(
      'getGrossMarketValue',
      null,
      period,
    );
  }

  @Get(ROUTER.ADMIN.ANALYTICS.GMV_CHART)
  @ApiResponse({
    status: 200,
    description: 'Success',
    isArray: true,
    type: GMVDto,
  })
  @UseGuards(HttpAuthGuard({ isAdmin: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get GMV Chart' })
  @ResponseMessage('Get GMV chart success')
  async getGmvChart(@Query() period: AnalyticsPeriodDto): Promise<GMVDto[]> {
    return this.adminService.callTransactionServiceMethod(
      'getGrossMarketValueChartData',
      null,
      period,
    );
  }

  @Get(ROUTER.ADMIN.ANALYTICS.GMV_FORECAST)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: GMVForecastDto,
  })
  @UseGuards(HttpAuthGuard({ isAdmin: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get GMV Forecast' })
  @ResponseMessage('Get GMV forecast success')
  async getGmvForecast(
    @Query() period: AnalyticsPeriodDto,
  ): Promise<GMVForecastDto> {
    return this.adminService.callTransactionServiceMethod(
      'getForecastGMV',
      null,
      period,
    );
  }

  @Get(ROUTER.ADMIN.ANALYTICS.SERVICE_FEE)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: Number,
  })
  @UseGuards(HttpAuthGuard({ isAdmin: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Service Fee' })
  @ResponseMessage('Get service fee success')
  async getServiceFee(@Query() period: AnalyticsPeriodDto): Promise<number> {
    return this.adminService.callTransactionServiceMethod(
      'getServiceFee',
      null,
      period,
    );
  }

  @Get(ROUTER.ADMIN.ANALYTICS.SERVICE_FEE_CHART)
  @ApiResponse({
    status: 200,
    description: 'Success',
    isArray: true,
    type: ServiceFeeDto,
  })
  @UseGuards(HttpAuthGuard({ isAdmin: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Service Fee Chart' })
  @ResponseMessage('Get service fee chart success')
  async getServiceFeeChart(
    @Query() period: AnalyticsPeriodDto,
  ): Promise<ServiceFeeDto[]> {
    return this.adminService.callTransactionServiceMethod(
      'getServiceFeeChartData',
      null,
      period,
    );
  }

  @Get(ROUTER.ADMIN.ANALYTICS.CR)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: Number,
  })
  @UseGuards(HttpAuthGuard({ isAdmin: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get CR' })
  @ResponseMessage('Get CR success')
  async getCR(@Query() period: AnalyticsPeriodDto): Promise<number> {
    return this.adminService.callTransactionServiceMethod(
      'getConversionRate',
      null,
      period,
    );
  }

  @Get(ROUTER.ADMIN.ANALYTICS.CR_CHART)
  @ApiResponse({
    status: 200,
    description: 'Success',
    isArray: true,
    type: CRDto,
  })
  @UseGuards(HttpAuthGuard({ isAdmin: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get CR Chart' })
  @ResponseMessage('Get CR chart success')
  async getCRChart(@Query() period: AnalyticsPeriodDto): Promise<CRDto[]> {
    return this.adminService.callTransactionServiceMethod(
      'getConversionRateChartData',
      null,
      period,
    );
  }

  @Get(ROUTER.ADMIN.ANALYTICS.AVERAGE_CONFIRMATION_TIME)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: Number,
  })
  @UseGuards(HttpAuthGuard({ isAdmin: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Average Confirmation Time' })
  @ResponseMessage('Get Average Confirmation Time success')
  async getAverageConfirmationTime(
    @Query() period: AnalyticsPeriodDto,
  ): Promise<number> {
    return this.adminService.callTransactionServiceMethod(
      'getAverageConfirmationTime',
      null,
      period,
    );
  }

  @Get(ROUTER.ADMIN.ANALYTICS.AVERAGE_CONFIRMATION_TIME_CHART)
  @ApiResponse({
    status: 200,
    description: 'Success',
    isArray: true,
    type: AverageConfirmationTimeDto,
  })
  @UseGuards(HttpAuthGuard({ isAdmin: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Average Confirmation Time Chart' })
  @ResponseMessage('Get Average Confirmation Time chart success')
  async getAverageConfirmationTimeChart(
    @Query() period: AnalyticsPeriodDto,
  ): Promise<AverageConfirmationTimeDto[]> {
    return this.adminService.callTransactionServiceMethod(
      'getAverageConfirmationTimeChartData',
      null,
      period,
    );
  }

  @Get(ROUTER.ADMIN.ANALYTICS.P95_CONFIRMATION_TIME)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: Number,
  })
  @UseGuards(HttpAuthGuard({ isAdmin: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get P95 Confirmation Time' })
  @ResponseMessage('Get P95 Confirmation Time success')
  async getP95ConfirmationTime(
    @Query() period: AnalyticsPeriodDto,
  ): Promise<number> {
    return this.adminService.callTransactionServiceMethod(
      'getP95ConfirmationTime',
      null,
      period,
    );
  }

  @Get(ROUTER.ADMIN.ANALYTICS.P95_CONFIRMATION_TIME_CHART)
  @ApiResponse({
    status: 200,
    description: 'Success',
    isArray: true,
    type: P95ConfirmationTimeDto,
  })
  @UseGuards(HttpAuthGuard({ isAdmin: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get P95 Confirmation Time Chart' })
  @ResponseMessage('Get P95 Confirmation Time chart success')
  async getP95ConfirmationTimeChart(
    @Query() period: AnalyticsPeriodDto,
  ): Promise<P95ConfirmationTimeDto[]> {
    return this.adminService.callTransactionServiceMethod(
      'getP95ConfirmationTimeChartData',
      null,
      period,
    );
  }

  @Get(ROUTER.ADMIN.ANALYTICS.DIRECT_DEPOSIT_SHARE)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: Number,
  })
  @UseGuards(HttpAuthGuard({ isAdmin: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Direct Deposit Share' })
  @ResponseMessage('Get Direct Deposit Share success')
  async getDirectDepositShare(
    @Query() period: AnalyticsPeriodDto,
  ): Promise<number> {
    return this.adminService.callTransactionServiceMethod(
      'getDirectDepositShare',
      null,
      period,
    );
  }

  @Get(ROUTER.ADMIN.ANALYTICS.DIRECT_DEPOSIT_SHARE_CHART)
  @ApiResponse({
    status: 200,
    description: 'Success',
    isArray: true,
    type: DirectDepositShareDto,
  })
  @UseGuards(HttpAuthGuard({ isAdmin: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Direct Deposit Share Chart' })
  @ResponseMessage('Get Direct Deposit Share chart success')
  async getDirectDepositShareChart(
    @Query() period: AnalyticsPeriodDto,
  ): Promise<DirectDepositShareDto[]> {
    return this.adminService.callTransactionServiceMethod(
      'getDirectDepositShareChartData',
      null,
      period,
    );
  }

  @Get(ROUTER.ADMIN.ANALYTICS.SLOWEST_TRANSACTIONS)
  @ApiResponse({
    status: 200,
    description: 'Success',
    isArray: true,
    type: TransactionDto,
  })
  @UseGuards(HttpAuthGuard({ isAdmin: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Slowest Transactions' })
  @ResponseMessage('Get Slowest Transactions success')
  async getSlowestTransactions(
    @Query() query: TopRequestDto,
  ): Promise<TransactionDto[]> {
    return this.adminService.callTransactionServiceMethod(
      'getTopSlowestTransactions',
      null,
      query.top,
      {
        startDate: query.startDate,
        endDate: query.endDate,
      },
    );
  }

  @Get(ROUTER.ADMIN.ANALYTICS.FAILURE_SHARE)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: Number,
  })
  @UseGuards(HttpAuthGuard({ isAdmin: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Failure Share' })
  @ResponseMessage('Get Failure Share success')
  async getFailureShare(@Query() period: AnalyticsPeriodDto): Promise<number> {
    return this.adminService.callTransactionServiceMethod(
      'getFailureShare',
      null,
      period,
    );
  }

  @Get(ROUTER.ADMIN.ANALYTICS.FAILURE_SHARE_CHART)
  @ApiResponse({
    status: 200,
    description: 'Success',
    isArray: true,
    type: FailuresShareDto,
  })
  @UseGuards(HttpAuthGuard({ isAdmin: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Failure Share Chart' })
  @ResponseMessage('Get Failure Share chart success')
  async getFailureShareChart(
    @Query() period: AnalyticsPeriodDto,
  ): Promise<FailuresShareDto[]> {
    return this.adminService.callTransactionServiceMethod(
      'getFailureShareChartData',
      null,
      period,
    );
  }

  @Get(ROUTER.ADMIN.ANALYTICS.ALERTS)
  @ApiResponse({
    status: 200,
    description: 'Success',
    isArray: true,
    type: String,
  })
  @UseGuards(HttpAuthGuard({ isAdmin: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Alerts' })
  @ResponseMessage('Get Alerts success')
  async getAlerts(): Promise<string[]> {
    return this.adminService.callTransactionServiceMethod('getSystemAlerts');
  }

  @Get(ROUTER.ADMIN.ANALYTICS.ACTIVE_MERCHANTS)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: Number,
  })
  @UseGuards(HttpAuthGuard({ isAdmin: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Active Merchants' })
  @ResponseMessage('Get Active Merchants success')
  async getActiveMerchants(
    @Query() period: AnalyticsPeriodDto,
  ): Promise<number> {
    return this.adminService.callTransactionServiceMethod(
      'getActiveMerchants',
      period,
    );
  }

  @Get(ROUTER.ADMIN.ANALYTICS.ACTIVE_MERCHANTS_CHART)
  @ApiResponse({
    status: 200,
    description: 'Success',
    isArray: true,
    type: ActiveMerchantsDto,
  })
  @UseGuards(HttpAuthGuard({ isAdmin: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Active Merchants Chart' })
  @ResponseMessage('Get Active Merchants chart success')
  async getActiveMerchantsChart(
    @Query() period: AnalyticsPeriodDto,
  ): Promise<ActiveMerchantsDto[]> {
    return this.adminService.callTransactionServiceMethod(
      'getActiveMerchantsChartData',
      period,
    );
  }

  @Get(ROUTER.ADMIN.ANALYTICS.NEW_MERCHANTS)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: Number,
  })
  @UseGuards(HttpAuthGuard({ isAdmin: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get New Merchants' })
  @ResponseMessage('Get New Merchants success')
  async getNewMerchants(@Query() period: AnalyticsPeriodDto): Promise<number> {
    return this.adminService.callTransactionServiceMethod(
      'getNewMerchants',
      period,
    );
  }

  @Get(ROUTER.ADMIN.ANALYTICS.NEW_MERCHANTS_HEATMAP)
  @ApiResponse({
    status: 200,
    description: 'Success',
    isArray: true,
    type: NewMerchantsCohortDto,
  })
  @UseGuards(HttpAuthGuard({ isAdmin: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get New Merchants Cohort' })
  @ResponseMessage('Get New Merchants Cohort success')
  async getNewMerchantsCohort(
    @Query() period: AnalyticsPeriodDto,
  ): Promise<NewMerchantsCohortDto[]> {
    return this.adminService.callTransactionServiceMethod(
      'getNewMerchantsCohortHeatmap',
      period,
    );
  }

  @Get(ROUTER.ADMIN.ANALYTICS.MERCHANT_RETENTION)
  @ApiResponse({
    status: 200,
    description: 'Success',
    isArray: true,
    type: MerchantRetentionDto,
  })
  @UseGuards(HttpAuthGuard({ isAdmin: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Merchant Retention' })
  @ResponseMessage('Get Merchant Retention success')
  async getMerchantRetention(
    @Query() period: AnalyticsPeriodDto,
  ): Promise<MerchantRetentionDto[]> {
    return this.adminService.callTransactionServiceMethod(
      'getMerchantRetentionCohorts',
      period,
    );
  }

  @Get(ROUTER.ADMIN.ANALYTICS.HOTSPOTS)
  @ApiResponse({
    status: 200,
    description: 'Success',
    isArray: true,
    type: HotspotsDto,
  })
  @UseGuards(HttpAuthGuard({ isAdmin: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Hotspots' })
  @ResponseMessage('Get Hotspots success')
  async getHotspots(
    @Query() period: AnalyticsPeriodDto,
  ): Promise<HotspotsDto[]> {
    return this.adminService.callTransactionServiceMethod(
      'getHotspots',
      period,
    );
  }
}
