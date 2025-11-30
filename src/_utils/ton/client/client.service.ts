import { TonClient, WalletContractV4, internal } from 'ton';
import { mnemonicNew, mnemonicToPrivateKey } from 'ton-crypto';

import { BaseLogger } from 'src/_core/logger/base-logger/base-logger';
import { Injectable } from '@nestjs/common';
import configuration from 'src/_core/config/configuration';
import { constants } from 'src/_core/config/constants';
import { exponentToNumber } from 'src/_utils/helpers';

const config = configuration();

@Injectable()
export class ClientService {
  constructor(private readonly logger: BaseLogger) {}

  private readonly client = new TonClient({
    endpoint: config.ton.client.rpc,
    apiKey: config.ton.client.rpcApiKey,
  });

  async createWallet() {
    const mnemonics = await mnemonicNew();
    const keyPair = await mnemonicToPrivateKey(mnemonics);

    const publicKey = keyPair.publicKey.toString('hex');
    const secretKey = keyPair.secretKey.toString('hex');

    const wallet = WalletContractV4.create({
      workchain: 0,
      publicKey: Buffer.from(publicKey, 'hex'),
    });

    const res = {
      publicKey,
      secretKey,
      readableAddress: wallet.address.toString({ bounceable: false }),
      walletId: wallet.address.toRawString(),
      mnemonic: mnemonics,
    };

    return res;
  }

  async getBalance(publicKey: string) {
    const wallet = WalletContractV4.create({
      workchain: 0,
      publicKey: Buffer.from(publicKey, 'hex'),
    });

    const contract = this.client.open(wallet);

    const balance = await contract.getBalance();

    return Number(balance) / 10 ** 9;
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
    const wallet = WalletContractV4.create({
      workchain: 0,
      publicKey: Buffer.from(publicKey, 'hex'),
    });

    const contract = this.client.open(wallet);

    const balance = await this.getBalance(publicKey);

    const withdrawableBalance = Number(
      (balance - constants.transactionFee).toFixed(9),
    );

    if (Number(withdrawableBalance) < (amount || 0)) {
      throw new Error('Insufficient balance');
    }

    const seqno = await contract.getSeqno();

    const transfer = contract.createTransfer({
      seqno,
      secretKey: Buffer.from(secretKey, 'hex'),
      messages: [
        internal({
          value: String(exponentToNumber(amount || withdrawableBalance)),
          to: toAddress,
          bounce: false,
        }),
      ],
    });

    await contract.send(transfer);

    this.logger.log(`Withdrawn ${withdrawableBalance} TON`);
  }
}
