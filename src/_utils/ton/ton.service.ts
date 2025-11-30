import { BlockchainService } from './blockchain/blockchain.service';
import { ClientService } from './client/client.service';
import { Injectable } from '@nestjs/common';
import { WebhookService } from './webhook/webhook.service';

@Injectable()
export class TonService {
  constructor(
    private readonly blockchainService: BlockchainService,
    private readonly clientService: ClientService,
    private readonly webhookService: WebhookService,
  ) {}

  async createWallet() {
    return this.clientService.createWallet();
  }

  async subscribeToWallet(walletId: string) {
    return this.webhookService.subscribeToWallet(walletId);
  }

  async getBalance(publicKey: string) {
    return this.clientService.getBalance(publicKey);
  }

  async withdrawFromWallet({
    publicKey,
    secretKey,
    toAddress,
    amount,
  }: {
    publicKey: string;
    secretKey: string;
    toAddress: string;
    amount?: number;
  }) {
    return this.clientService.withdrawFromWallet({
      publicKey,
      secretKey,
      toAddress,
      amount,
    });
  }

  async getTransactionInfo(transactionHash: string) {
    try {
      return this.blockchainService.getTransactionInfo(transactionHash);
    } catch (error) {
      return null;
    }
  }
}
