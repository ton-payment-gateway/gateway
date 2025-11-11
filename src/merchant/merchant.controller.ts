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
}
