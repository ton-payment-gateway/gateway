import { ExecutionContext, Injectable } from '@nestjs/common';
import {
  NotFoundException,
  UnauthorizedException,
} from 'src/_core/exception/exception';

import { HttpAuthGuard } from 'src/auth/guards/http-auth.guard';
import { MerchantService } from '../merchant.service';
import { ModuleRef } from '@nestjs/core';
import { Request } from 'express';
import { SessionData } from 'src/auth/types';

@Injectable()
export class MerchantOwnerGuard extends HttpAuthGuard() {
  constructor(
    readonly moduleRef: ModuleRef,
    private readonly merchantService: MerchantService,
  ) {
    super(moduleRef);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthorized = await super.canActivate(context);
    if (!isAuthorized) return false;

    const request = context.switchToHttp().getRequest<Request>();
    const user: SessionData = request['user'];

    if (!user) {
      throw new UnauthorizedException(
        'User not found in request. Please check your middleware',
      );
    }

    const merchantId = request.params?.merchantId || request.params?.id;

    if (!merchantId) {
      throw new UnauthorizedException('Merchant ID is required');
    }

    const merchant = await this.merchantService.findOne({
      where: { id: merchantId, userId: user.id },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    request['merchant'] = merchant;

    return true;
  }
}
