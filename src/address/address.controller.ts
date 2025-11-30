import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { AddressService } from './address.service';
import { ROUTER } from 'src/_core/router';
import {
  CreateAddressDto,
  ResCreateAddressDto,
} from './dto/create-address.dto';
import { ResExceptionDto } from 'src/_core/exception/dto/exception.dto';
import { ResponseMessage } from 'src/_utils/decorators/response-message.decorator';
import { MerchantIdData } from 'src/_utils/decorators/merchant-id.decorator';
import { ApiKeyOrTokenGuard } from 'src/_utils/guards/api-key-or-token.guard';
import { BadException, NotFoundException } from 'src/_core/exception/exception';
import { AuthData } from 'src/_utils/decorators/auth-data.decorator';
import { SessionData } from 'src/auth/types';
import { MerchantService } from 'src/merchant/merchant.service';

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
@UseGuards(ApiKeyOrTokenGuard)
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
    private readonly merchantService: MerchantService,
  ) {}

  @Post(ROUTER.ADDRESS.CREATE)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ResCreateAddressDto,
  })
  @ResponseMessage('Create address success')
  async createAddress(
    @Body() data: CreateAddressDto,
    @AuthData() session: SessionData,
    @MerchantIdData() merchantId: string,
  ): Promise<ResCreateAddressDto> {
    if (
      data.merchantId &&
      !(await this.merchantService.findOne({
        where: { id: data.merchantId, userId: session.id },
      }))
    ) {
      throw new NotFoundException('Merchant not found');
    }

    if (!(merchantId || data.merchantId)) {
      throw new BadException('Merchant ID is required');
    }

    return this.addressService.createAddress(
      merchantId || data.merchantId,
      data,
    );
  }
}
