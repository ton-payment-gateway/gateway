import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionData } from 'src/auth/types';
import configuration from '../../_core/config/configuration';

const config = configuration();

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  private createJwt(
    data: Record<string, unknown>,
    secret: string,
    expiresIn?: string | number,
  ) {
    const options = expiresIn
      ? {
          secret,
          expiresIn,
        }
      : {
          secret,
        };

    return this.jwtService.sign(data, options);
  }

  create({
    payload,
    isRefresh,
    isAdmin,
  }: {
    payload: SessionData;
    isRefresh?: boolean;
    isAdmin?: boolean;
  }): string {
    const secret = isRefresh
      ? isAdmin
        ? config.auth.admin.refresh.secret
        : config.auth.refreshSecret
      : isAdmin
        ? config.auth.admin.access.secret
        : config.auth.accessSecret;
    const ttl = isRefresh
      ? isAdmin
        ? config.auth.admin.refresh.ttl
        : config.auth.refreshTtl
      : isAdmin
        ? config.auth.admin.access.ttl
        : config.auth.accessTtl;

    return this.createJwt(payload, secret, ttl);
  }

  async verify<T>({
    token,
    isRefresh,
    isAdmin,
  }: {
    token: string;
    isRefresh?: boolean;
    isAdmin?: boolean;
  }): Promise<T> {
    const secret = isRefresh
      ? isAdmin
        ? config.auth.admin.refresh.secret
        : config.auth.refreshSecret
      : isAdmin
        ? config.auth.admin.access.secret
        : config.auth.accessSecret;

    try {
      const status = await this.jwtService.verifyAsync(token, {
        secret,
      });
      return status;
    } catch {
      return null;
    }
  }

  decode<T>(token: string): T {
    return this.jwtService.decode(token) as T;
  }
}
