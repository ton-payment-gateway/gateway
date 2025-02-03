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
  }: {
    payload: SessionData;
    isRefresh?: boolean;
  }): string {
    const secret = isRefresh
      ? config.auth.refreshSecret
      : config.auth.accessSecret;
    const ttl = isRefresh ? config.auth.refreshTtl : config.auth.accessTtl;

    return this.createJwt(payload, secret, ttl);
  }

  async verify<T>({
    token,
    isRefresh,
  }: {
    token: string;
    isRefresh?: boolean;
  }): Promise<T> {
    const secret = isRefresh
      ? config.auth.refreshSecret
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
