import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ApiKeyService } from './api-key.service';
import { MerchantOwnerGuard } from 'src/merchant/guards/merchant-owner.guard';
import { ROUTER } from 'src/_core/router';
import { ResExceptionDto } from 'src/_core/exception/dto/exception.dto';
import { ResGetApiKeysDto } from './dto/get-api-keys.dto';
import { ResponseMessage } from 'src/_utils/decorators/response-message.decorator';
import { MerchantData } from 'src/_utils/decorators/merchant-data.decorator';
import { Merchant } from 'src/_entities/merchant.entity';
import { PaginationDto } from 'src/_utils/dto/pagination.dto';
import { MerchantIdDto } from 'src/_utils/dto/merchant-id.dto';
import { ApiKeyIdDto, ResApiKeyDto } from './dto/api-key.dto';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

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
@ApiTags('API Key')
@Controller('merchant/:merchantId/api-key')
@ApiBearerAuth()
@UseGuards(MerchantOwnerGuard)
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Get(ROUTER.API_KEY.GET_ALL)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ResGetApiKeysDto,
  })
  @ResponseMessage('Get all api keys success')
  async getAll(
    @MerchantData() merchant: Merchant,
    @Query() pagination: PaginationDto,
    @Param() _: MerchantIdDto,
  ): Promise<ResGetApiKeysDto> {
    return this.apiKeyService.getAll(merchant.id, pagination);
  }

  @Get(ROUTER.API_KEY.GET_ONE)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ResApiKeyDto,
  })
  @ResponseMessage('Get api key success')
  async getOne(@Param() params: ApiKeyIdDto): Promise<ResApiKeyDto> {
    return this.apiKeyService.getOne(params.merchantId, params.id);
  }

  @Post(ROUTER.API_KEY.CREATE)
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: ResApiKeyDto,
  })
  @ResponseMessage('Create api key success')
  async create(
    @MerchantData() merchant: Merchant,
    @Param() _: MerchantIdDto,
    @Body() data: CreateApiKeyDto,
  ): Promise<ResApiKeyDto> {
    return this.apiKeyService.createApiKey(merchant.id, data);
  }

  @Delete(ROUTER.API_KEY.DELETE)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ResponseMessage('Delete api key success')
  async delete(@Param() params: ApiKeyIdDto): Promise<void> {
    return this.apiKeyService.deleteApiKey(params.merchantId, params.id);
  }
}
