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
import { IdDto } from 'src/_utils/dto/id.dto';
import { AuthData } from 'src/_utils/decorators/auth-data.decorator';
import { SessionData } from 'src/auth/types';
import { ResMerchantDto } from './dto/merchant.dto';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { PaginationDto } from 'src/_utils/dto/pagination.dto';
import { ResGetMerchantsDto } from './dto/get-merchants.dto';

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
@UseGuards(HttpAuthGuard())
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Get(ROUTER.MERCHANT.GET_ALL)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ResGetMerchantsDto,
  })
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
  @ResponseMessage('Get one merchant success')
  async getOne(
    @Param() param: IdDto,
    @AuthData() session: SessionData,
  ): Promise<ResMerchantDto> {
    return this.merchantService.getOne(session.id, param.id);
  }

  @Post(ROUTER.MERCHANT.CREATE)
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: ResMerchantDto,
  })
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
  @ResponseMessage('Update merchant success')
  async update(
    @Param() param: IdDto,
    @Body() body: UpdateMerchantDto,
    @AuthData() session: SessionData,
  ): Promise<ResMerchantDto> {
    return this.merchantService.update(session.id, param.id, body);
  }

  @Delete(ROUTER.MERCHANT.DELETE)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ResponseMessage('Delete merchant success')
  async delete(
    @Param() param: IdDto,
    @AuthData() session: SessionData,
  ): Promise<void> {
    return this.merchantService.deleteMerchant(session.id, param.id);
  }
}
