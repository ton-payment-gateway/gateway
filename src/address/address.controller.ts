import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { AddressService } from './address.service';
import { ApiKeyGuard } from 'src/api-key/guards/api-key.guard';
import { ROUTER } from 'src/_core/router';
import {
  CreateAddressDto,
  ResCreateAddressDto,
} from './dto/create-address.dto';
import { ResExceptionDto } from 'src/_core/exception/dto/exception.dto';
import { ResponseMessage } from 'src/_utils/decorators/response-message.decorator';
import { MerchantIdData } from 'src/_utils/decorators/merchant-id.decorator';

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
@ApiTags('Payment address')
@Controller('address')
@ApiBearerAuth()
@UseGuards(ApiKeyGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post(ROUTER.ADDRESS.CREATE)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ResCreateAddressDto,
  })
  @ResponseMessage('Create address success')
  async createAddress(
    @Body() data: CreateAddressDto,
    @MerchantIdData() merchantId: string,
  ): Promise<ResCreateAddressDto> {
    return this.addressService.createAddress(merchantId, data);
  }
}
