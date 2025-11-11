import { ExecutionContext, Injectable } from '@nestjs/common';

import { ApiKeyService } from 'src/api-key/api-key.service';
import { Request } from 'express';
import { SessionData } from 'src/auth/types';
import { TokenService } from '../token/token.service';
import { UnauthorizedException } from 'src/_core/exception/exception';

@Injectable()
export class ApiKeyOrTokenGuard {
  constructor(
    private readonly tokenService: TokenService,
    private readonly apiKeyService: ApiKeyService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const accessTokenOrApiKey = request?.headers?.authorization
      ?.split('Bearer')[1]
      ?.trim();

    if (!accessTokenOrApiKey) {
      throw new UnauthorizedException();
    }

    try {
      const user = await this.tokenService.verify<SessionData>({
        token: accessTokenOrApiKey,
        isRefresh: false,
      });

      if (!user) {
        return this.verifyApiKey(accessTokenOrApiKey, request);
      }

      request['user'] = user;
      return true;
    } catch (error) {
      return this.verifyApiKey(accessTokenOrApiKey, request);
    }
  }

  async verifyApiKey(apiKey: string, request: Request): Promise<boolean> {
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
