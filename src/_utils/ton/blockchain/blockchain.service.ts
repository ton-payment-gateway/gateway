import { HttpService } from '@nestjs/axios';
import { ITonTransaction } from '../types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlockchainService {
  constructor(private readonly httpService: HttpService) {}

  async getTransactionInfo(transactionHash: string) {
    const { data } = await this.httpService.axiosRef.get<ITonTransaction>(
      `v2/blockchain/transactions/${transactionHash}`,
    );

    return data;
  }
}
