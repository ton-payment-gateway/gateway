import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResExceptionDto } from 'src/_core/exception/dto/exception.dto';
import { MerchantService } from './merchant.service';
import { HttpAuthGuard } from 'src/auth/guards/http-auth.guard';
import { ROUTER } from 'src/_core/router';
import { ResponseMessage } from 'src/_utils/decorators/response-message.decorator';
import { AuthData } from 'src/_utils/decorators/auth-data.decorator';
import { SessionData } from 'src/auth/types';
import { ResMerchantDto } from './dto/merchant.dto';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { PaginationDto } from 'src/_utils/dto/pagination.dto';
import { ResGetMerchantsDto } from './dto/get-merchants.dto';
import { MerchantOwnerGuard } from './guards/merchant-owner.guard';
import { MerchantData } from 'src/_utils/decorators/merchant-data.decorator';
import { Merchant } from 'src/_entities/merchant.entity';
import { IdDto } from 'src/_utils/dto/id.dto';
import { WithdrawMerchantDto } from './dto/withdraw-merchant.dto';
import { AnalyticsPeriodDto } from 'src/_utils/dto/anlytics-period.dto';
import {
  AverageConfirmationTimeDto,
  AverageOrderValueDto,
  CRDto,
  DirectDepositShareDto,
  FailuresShareDto,
  FunnelChartDto,
  GMVDto,
  GMVForecastDto,
  HourlyHeatmapDto,
  P95ConfirmationTimeDto,
  RepeatCustomerRateDto,
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
@ApiTags('Merchant')
@Controller('merchant')
@ApiBearerAuth()
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Get(ROUTER.MERCHANT.GET_ALL)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ResGetMerchantsDto,
  })
  @UseGuards(HttpAuthGuard())
  @ResponseMessage('Get all merchant success')
  async getAll(
    @AuthData() session: SessionData,
    @Query() pagination: PaginationDto,
  ): Promise<ResGetMerchantsDto> {
    return this.merchantService.getAll(session.id, pagination);
  }

  @Get(ROUTER.MERCHANT.GET_ONE)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ResMerchantDto,
  })
  @UseGuards(MerchantOwnerGuard)
  @ResponseMessage('Get one merchant success')
  async getOne(
    @MerchantData() merchant: Merchant,
    @Param() _: IdDto,
  ): Promise<ResMerchantDto> {
    return this.merchantService.getOne(merchant);
  }

  @Post(ROUTER.MERCHANT.CREATE)
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: ResMerchantDto,
  })
  @UseGuards(HttpAuthGuard())
  @ResponseMessage('Create merchant success')
  async create(
    @Body() body: CreateMerchantDto,
    @AuthData() session: SessionData,
  ): Promise<ResMerchantDto> {
    return this.merchantService.createMerchant(session.id, body);
  }

  @Put(ROUTER.MERCHANT.UPDATE)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ResMerchantDto,
  })
  @UseGuards(MerchantOwnerGuard)
  @ResponseMessage('Update merchant success')
  async update(
    @Body() body: UpdateMerchantDto,
    @MerchantData() merchant: Merchant,
    @Param() _: IdDto,
  ): Promise<ResMerchantDto> {
    return this.merchantService.update(merchant, body);
  }

  @Delete(ROUTER.MERCHANT.DELETE)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @UseGuards(MerchantOwnerGuard)
  @ResponseMessage('Delete merchant success')
  async delete(
    @MerchantData() merchant: Merchant,
    @Param() _: IdDto,
  ): Promise<void> {
    return this.merchantService.deleteMerchant(merchant);
  }

  @Post(ROUTER.MERCHANT.WITHDRAW)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @UseGuards(MerchantOwnerGuard)
  @ResponseMessage('Withdraw from merchant success')
  async withdraw(
    @Body() body: WithdrawMerchantDto,
    @MerchantData() merchant: Merchant,
    @Param() _: IdDto,
  ): Promise<void> {
    return this.merchantService.withdrawMerchant(merchant.id, body);
  }

  @Post(ROUTER.MERCHANT.COLLECT_ADDRESSES)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @UseGuards(MerchantOwnerGuard)
  @ResponseMessage('Collect addresses for merchant success')
  async collectAddresses(
    @MerchantData() merchant: Merchant,
    @Param() _: IdDto,
  ): Promise<void> {
    return this.merchantService.withdrawAddressesToMerchant(merchant.id);
  }

  // Analytics endpoints
  @Get(ROUTER.MERCHANT.ANALYTICS.GMV)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: Number,
  })
  @UseGuards(MerchantOwnerGuard)
  @ResponseMessage('Get merchant GMV success')
  async getGMV(
    @MerchantData() merchant: Merchant,
    @Param() _: IdDto,
    @Query() period: AnalyticsPeriodDto,
  ): Promise<number> {
    return this.merchantService.callTransactionServiceMethod(
      'getGrossMarketValue',
      merchant.id,
      period,
    );
  }

  @Get(ROUTER.MERCHANT.ANALYTICS.GMV_CHART)
  @ApiResponse({
    status: 200,
    description: 'Success',
    isArray: true,
    type: GMVDto,
  })
  @UseGuards(MerchantOwnerGuard)
  @ResponseMessage('Get merchant GMV chart success')
  async getGMVChart(
    @MerchantData() merchant: Merchant,
    @Param() _: IdDto,
    @Query() period: AnalyticsPeriodDto,
  ): Promise<GMVDto[]> {
    return this.merchantService.callTransactionServiceMethod(
      'getGrossMarketValueChartData',
      merchant.id,
      period,
    );
  }

  @Get(ROUTER.MERCHANT.ANALYTICS.GMV_FORECAST)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: GMVForecastDto,
  })
  @UseGuards(MerchantOwnerGuard)
  @ResponseMessage('Get merchant GMV forecast success')
  async getGMVForecast(
    @MerchantData() merchant: Merchant,
    @Param() _: IdDto,
    @Query() period: AnalyticsPeriodDto,
  ): Promise<GMVForecastDto> {
    return this.merchantService.callTransactionServiceMethod(
      'getForecastGMV',
      merchant.id,
      period,
    );
  }

  @Get(ROUTER.MERCHANT.ANALYTICS.SERVICE_FEE)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: Number,
  })
  @UseGuards(MerchantOwnerGuard)
  @ResponseMessage('Get merchant service fee success')
  async getServiceFee(
    @MerchantData() merchant: Merchant,
    @Param() _: IdDto,
    @Query() period: AnalyticsPeriodDto,
  ): Promise<number> {
    return this.merchantService.callTransactionServiceMethod(
      'getServiceFee',
      merchant.id,
      period,
    );
  }

  @Get(ROUTER.MERCHANT.ANALYTICS.SERVICE_FEE_CHART)
  @ApiResponse({
    status: 200,
    description: 'Success',
    isArray: true,
    type: ServiceFeeDto,
  })
  @UseGuards(MerchantOwnerGuard)
  @ResponseMessage('Get merchant service fee chart success')
  async getServiceFeeChart(
    @MerchantData() merchant: Merchant,
    @Param() _: IdDto,
    @Query() period: AnalyticsPeriodDto,
  ): Promise<ServiceFeeDto[]> {
    return this.merchantService.callTransactionServiceMethod(
      'getServiceFeeChartData',
      merchant.id,
      period,
    );
  }

  @Get(ROUTER.MERCHANT.ANALYTICS.CR)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: Number,
  })
  @UseGuards(MerchantOwnerGuard)
  @ResponseMessage('Get merchant conversion rate success')
  async getConversionRate(
    @MerchantData() merchant: Merchant,
    @Param() _: IdDto,
    @Query() period: AnalyticsPeriodDto,
  ): Promise<number> {
    return this.merchantService.callTransactionServiceMethod(
      'getConversionRate',
      merchant.id,
      period,
    );
  }

  @Get(ROUTER.MERCHANT.ANALYTICS.CR_CHART)
  @ApiResponse({
    status: 200,
    description: 'Success',
    isArray: true,
    type: CRDto,
  })
  @UseGuards(MerchantOwnerGuard)
  @ResponseMessage('Get merchant conversion rate chart success')
  async getConversionRateChart(
    @MerchantData() merchant: Merchant,
    @Param() _: IdDto,
    @Query() period: AnalyticsPeriodDto,
  ): Promise<CRDto[]> {
    return this.merchantService.callTransactionServiceMethod(
      'getConversionRateChartData',
      merchant.id,
      period,
    );
  }

  @Get(ROUTER.MERCHANT.ANALYTICS.AVERAGE_CONFIRMATION_TIME)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: Number,
  })
  @UseGuards(MerchantOwnerGuard)
  @ResponseMessage('Get merchant average confirmation time success')
  async getAverageConfirmationTime(
    @MerchantData() merchant: Merchant,
    @Param() _: IdDto,
    @Query() period: AnalyticsPeriodDto,
  ): Promise<number> {
    return this.merchantService.callTransactionServiceMethod(
      'getAverageConfirmationTime',
      merchant.id,
      period,
    );
  }

  @Get(ROUTER.MERCHANT.ANALYTICS.AVERAGE_CONFIRMATION_TIME_CHART)
  @ApiResponse({
    status: 200,
    description: 'Success',
    isArray: true,
    type: AverageConfirmationTimeDto,
  })
  @UseGuards(MerchantOwnerGuard)
  @ResponseMessage('Get merchant average confirmation time chart success')
  async getAverageConfirmationTimeChart(
    @MerchantData() merchant: Merchant,
    @Param() _: IdDto,
    @Query() period: AnalyticsPeriodDto,
  ): Promise<AverageConfirmationTimeDto[]> {
    return this.merchantService.callTransactionServiceMethod(
      'getAverageConfirmationTimeChartData',
      merchant.id,
      period,
    );
  }

  @Get(ROUTER.MERCHANT.ANALYTICS.P95_CONFIRMATION_TIME)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: Number,
  })
  @UseGuards(MerchantOwnerGuard)
  @ResponseMessage('Get merchant P95 confirmation time success')
  async getP95ConfirmationTime(
    @MerchantData() merchant: Merchant,
    @Param() _: IdDto,
    @Query() period: AnalyticsPeriodDto,
  ): Promise<number> {
    return this.merchantService.callTransactionServiceMethod(
      'getP95ConfirmationTime',
      merchant.id,
      period,
    );
  }

  @Get(ROUTER.MERCHANT.ANALYTICS.P95_CONFIRMATION_TIME_CHART)
  @ApiResponse({
    status: 200,
    description: 'Success',
    isArray: true,
    type: P95ConfirmationTimeDto,
  })
  @UseGuards(MerchantOwnerGuard)
  @ResponseMessage('Get merchant P95 confirmation time chart success')
  async getP95ConfirmationTimeChart(
    @MerchantData() merchant: Merchant,
    @Param() _: IdDto,
    @Query() period: AnalyticsPeriodDto,
  ): Promise<P95ConfirmationTimeDto[]> {
    return this.merchantService.callTransactionServiceMethod(
      'getP95ConfirmationTimeChartData',
      merchant.id,
      period,
    );
  }

  @Get(ROUTER.MERCHANT.ANALYTICS.DIRECT_DEPOSIT_SHARE)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: Number,
  })
  @UseGuards(MerchantOwnerGuard)
  @ResponseMessage('Get merchant direct deposit share success')
  async getDirectDepositShare(
    @MerchantData() merchant: Merchant,
    @Param() _: IdDto,
    @Query() period: AnalyticsPeriodDto,
  ): Promise<number> {
    return this.merchantService.callTransactionServiceMethod(
      'getDirectDepositShare',
      merchant.id,
      period,
    );
  }

  @Get(ROUTER.MERCHANT.ANALYTICS.DIRECT_DEPOSIT_SHARE_CHART)
  @ApiResponse({
    status: 200,
    description: 'Success',
    isArray: true,
    type: DirectDepositShareDto,
  })
  @UseGuards(MerchantOwnerGuard)
  @ResponseMessage('Get merchant direct deposit share chart success')
  async getDirectDepositShareChart(
    @MerchantData() merchant: Merchant,
    @Param() _: IdDto,
    @Query() period: AnalyticsPeriodDto,
  ): Promise<DirectDepositShareDto[]> {
    return this.merchantService.callTransactionServiceMethod(
      'getDirectDepositShareChartData',
      merchant.id,
      period,
    );
  }

  @Get(ROUTER.MERCHANT.ANALYTICS.AOV)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: Number,
  })
  @UseGuards(MerchantOwnerGuard)
  @ResponseMessage('Get merchant AOV success')
  async getAOV(
    @MerchantData() merchant: Merchant,
    @Param() _: IdDto,
    @Query() period: AnalyticsPeriodDto,
  ): Promise<number> {
    return this.merchantService.callTransactionServiceMethod(
      'getAverageOrderValue',
      merchant.id,
      period,
    );
  }

  @Get(ROUTER.MERCHANT.ANALYTICS.AOV_CHART)
  @ApiResponse({
    status: 200,
    description: 'Success',
    isArray: true,
    type: AverageOrderValueDto,
  })
  @UseGuards(MerchantOwnerGuard)
  @ResponseMessage('Get merchant AOV chart success')
  async getAOVChart(
    @MerchantData() merchant: Merchant,
    @Param() _: IdDto,
    @Query() period: AnalyticsPeriodDto,
  ): Promise<AverageOrderValueDto[]> {
    return this.merchantService.callTransactionServiceMethod(
      'getAverageOrderValueChartData',
      merchant.id,
      period,
    );
  }

  @Get(ROUTER.MERCHANT.ANALYTICS.REPEAT_CUSTOMER_RATE)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: Number,
  })
  @UseGuards(MerchantOwnerGuard)
  @ResponseMessage('Get merchant repeat customer rate success')
  async getRepeatCustomerRate(
    @MerchantData() merchant: Merchant,
    @Param() _: IdDto,
    @Query() period: AnalyticsPeriodDto,
  ): Promise<number> {
    return this.merchantService.callTransactionServiceMethod(
      'getRepeatCustomerRate',
      merchant.id,
      period,
    );
  }

  @Get(ROUTER.MERCHANT.ANALYTICS.REPEAT_CUSTOMER_RATE_CHART)
  @ApiResponse({
    status: 200,
    description: 'Success',
    isArray: true,
    type: RepeatCustomerRateDto,
  })
  @UseGuards(MerchantOwnerGuard)
  @ResponseMessage('Get merchant repeat customer rate chart success')
  async getRepeatCustomerRateChart(
    @MerchantData() merchant: Merchant,
    @Param() _: IdDto,
    @Query() period: AnalyticsPeriodDto,
  ): Promise<RepeatCustomerRateDto[]> {
    return this.merchantService.callTransactionServiceMethod(
      'getRepeatCustomerRateChartData',
      merchant.id,
      period,
    );
  }

  @Get(ROUTER.MERCHANT.ANALYTICS.FUNNEL_CHART)
  @ApiResponse({
    status: 200,
    description: 'Success',
    isArray: true,
    type: FunnelChartDto,
  })
  @UseGuards(MerchantOwnerGuard)
  @ResponseMessage('Get merchant funnel chart success')
  async getFunnelChart(
    @MerchantData() merchant: Merchant,
    @Param() _: IdDto,
    @Query() period: AnalyticsPeriodDto,
  ): Promise<FunnelChartDto[]> {
    return this.merchantService.callTransactionServiceMethod(
      'getFunnelChartData',
      merchant.id,
      period,
    );
  }

  @Get(ROUTER.MERCHANT.ANALYTICS.HOURLY_HEATMAP)
  @ApiResponse({
    status: 200,
    description: 'Success',
    isArray: true,
    type: HourlyHeatmapDto,
  })
  @UseGuards(MerchantOwnerGuard)
  @ResponseMessage('Get merchant hourly heatmap success')
  async getHourlyHeatmap(
    @MerchantData() merchant: Merchant,
    @Param() _: IdDto,
    @Query() period: AnalyticsPeriodDto,
  ): Promise<HourlyHeatmapDto[]> {
    return this.merchantService.callTransactionServiceMethod(
      'getHourlyHeatmap',
      merchant.id,
      period,
    );
  }

  @Get(ROUTER.MERCHANT.ANALYTICS.SLOWEST_TRANSACTIONS)
  @ApiResponse({
    status: 200,
    description: 'Success',
    isArray: true,
    type: TransactionDto,
  })
  @UseGuards(MerchantOwnerGuard)
  @ResponseMessage('Get merchant slowest transactions success')
  async getSlowestTransactions(
    @MerchantData() merchant: Merchant,
    @Param() _: IdDto,
    @Query() query: TopRequestDto,
  ): Promise<TransactionDto[]> {
    return this.merchantService.callTransactionServiceMethod(
      'getTopSlowestTransactions',
      merchant.id,
      query.top,
      {
        startDate: query.startDate,
        endDate: query.endDate,
      },
    );
  }

  @Get(ROUTER.MERCHANT.ANALYTICS.ALERTS)
  @ApiResponse({
    status: 200,
    description: 'Success',
    isArray: true,
    type: String,
  })
  @UseGuards(MerchantOwnerGuard)
  @ResponseMessage('Get merchant alerts success')
  async getAlerts(
    @MerchantData() merchant: Merchant,
    @Param() _: IdDto,
  ): Promise<string[]> {
    return this.merchantService.callTransactionServiceMethod(
      'getMerchantAlerts',
      merchant.id,
    );
  }

  @Get(ROUTER.MERCHANT.ANALYTICS.FAILURE_SHARE)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: Number,
  })
  @UseGuards(MerchantOwnerGuard)
  @ResponseMessage('Get merchant failure share success')
  async getFailureShare(
    @MerchantData() merchant: Merchant,
    @Param() _: IdDto,
    @Query() period: AnalyticsPeriodDto,
  ): Promise<number> {
    return this.merchantService.callTransactionServiceMethod(
      'getFailureShare',
      merchant.id,
      period,
    );
  }

  @Get(ROUTER.MERCHANT.ANALYTICS.FAILURE_SHARE_CHART)
  @ApiResponse({
    status: 200,
    description: 'Success',
    isArray: true,
    type: FailuresShareDto,
  })
  @UseGuards(MerchantOwnerGuard)
  @ResponseMessage('Get merchant failure share chart success')
  async getFailureShareChart(
    @MerchantData() merchant: Merchant,
    @Param() _: IdDto,
    @Query() period: AnalyticsPeriodDto,
  ): Promise<FailuresShareDto[]> {
    return this.merchantService.callTransactionServiceMethod(
      'getFailureShareChartData',
      merchant.id,
      period,
    );
  }
}
