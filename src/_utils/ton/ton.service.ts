import { BlockchainService } from './blockchain/blockchain.service';
import { ClientService } from './client/client.service';
import { Injectable } from '@nestjs/common';
import { WebhookService } from './webhook/webhook.service';

@Injectable()
export class TonService {
  constructor(
    private readonly blockchainService: BlockchainService,
    private readonly clientService: ClientService,
    private readonly wbhookService: WebhookService,
  ) {}

  async createWallet() {
    return this.clientService.createWallet();
  }

  async subscribeToWallet(walletId: string) {
    return this.wbhookService.subscribeToWallet(walletId);
  }

  async withdrawFromWallet({
    publicKey,
    secretKey,
  }: {
    publicKey: string;
    secretKey: string;
  }) {
    return this.clientService.withdrawFromWallet({ publicKey, secretKey });
  }

  async getTransactionInfo(transactionHash: string) {
    try {
      return this.blockchainService.getTransactionInfo(transactionHash);
    } catch (error) {
      return null;
    }
  }
}
