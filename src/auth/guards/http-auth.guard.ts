import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
} from '@nestjs/common';

import { ModuleRef } from '@nestjs/core';
import { Request } from 'express';
import { SessionData } from '../types';
import { TokenService } from '../../_utils/token/token.service';
import { UnauthorizedException } from '../../_core/exception/exception';

export const HttpAuthGuard = ({
  isRefresh = false,
}: { isRefresh?: boolean } = {}) => {
  @Injectable()
  class HttpAuthGuardMixin implements CanActivate {
    readonly tokenService: TokenService;

    constructor(readonly moduleRef: ModuleRef) {
      this.tokenService = this.moduleRef.get(TokenService, { strict: false });
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<Request>();

      const accessToken = request?.headers?.authorization
        ?.split('Bearer')[1]
        ?.trim();

      if (accessToken) {
        try {
          const user = await this.tokenService.verify<SessionData>({
            token: accessToken,
            isRefresh,
          });

          if (!user) {
            throw new UnauthorizedException();
          }

          request['user'] = user;
          return true;
        } catch (error) {
          throw new UnauthorizedException();
        }
      }

      throw new UnauthorizedException();
    }
  }

  const guard = mixin(HttpAuthGuardMixin);
  return guard;
};
