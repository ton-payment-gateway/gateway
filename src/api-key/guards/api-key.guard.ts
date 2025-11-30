import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { ApiKeyService } from '../api-key.service';
import { Request } from 'express';
import { UnauthorizedException } from '../../_core/exception/exception';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const apiKey = request?.headers?.authorization?.split('Bearer')[1]?.trim();

    if (!apiKey) {
      throw new UnauthorizedException();
    }

    const key = await this.apiKeyService.findOne({
      where: { key: apiKey },
    });

    if (!key) {
      throw new UnauthorizedException();
    }

    request['merchantId'] = key.merchantId;

    return true;
  }
}
