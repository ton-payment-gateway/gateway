import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { ResAuthDto } from 'src/auth/dto/auth.dto';
import { TokenService } from 'src/_utils/token/token.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { UnauthorizedException } from 'src/_core/exception/exception';
import configuration from 'src/_core/config/configuration';

const config = configuration();

@Injectable()
export class AdminService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly transactionService: TransactionService,
  ) {}

  login(data: LoginDto): ResAuthDto {
    if (
      data.username !== config.auth.admin.username &&
      data.password !== config.auth.admin.password
    ) {
      throw new UnauthorizedException();
    }

    return {
      accessToken: this.tokenService.create({
        payload: {
          id: 'admin-id',
          username: data.username,
        },
        isRefresh: false,
        isAdmin: true,
      }),
      refreshToken: this.tokenService.create({
        payload: {
          id: 'admin-id',
          username: data.username,
        },
        isRefresh: true,
        isAdmin: true,
      }),
    };
  }

  refresh(): ResAuthDto {
    return {
      accessToken: this.tokenService.create({
        payload: {
          id: 'admin-id',
          username: config.auth.admin.username,
        },
        isRefresh: false,
        isAdmin: true,
      }),
      refreshToken: this.tokenService.create({
        payload: {
          id: 'admin-id',
          username: config.auth.admin.username,
        },
        isRefresh: true,
        isAdmin: true,
      }),
    };
  }

  async callTransactionServiceMethod<K extends keyof TransactionService>(
    method: K,
    ...args: Parameters<TransactionService[K]>
  ): Promise<ReturnType<TransactionService[K]>> {
    return (this.transactionService[method] as any)(...args);
  }
}
