import { TonClient, WalletContractV4, internal } from 'ton';
import { mnemonicNew, mnemonicToPrivateKey } from 'ton-crypto';

import { BaseLogger } from 'src/_core/logger/base-logger/base-logger';
import { Injectable } from '@nestjs/common';
import configuration from 'src/_core/config/configuration';
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

    const publicKey = Buffer.from(keyPair.publicKey).toString('hex');
    const secretKey = Buffer.from(keyPair.secretKey).toString('hex');

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

  async withdrawFromWallet({
    publicKey,
    secretKey,
  }: {
    publicKey: string;
    secretKey: string;
  }) {
    const wallet = WalletContractV4.create({
      workchain: 0,
      publicKey: Buffer.from(publicKey, 'hex'),
    });

    const contract = this.client.open(wallet);

    const balance = await contract.getBalance();

    const withdrawableBalance = Number(
      (Number(balance) / 10 ** 9 - 0.05).toFixed(5),
    );

    if (Number(withdrawableBalance) < 0) return;

    const seqno = await contract.getSeqno();

    const transfer = contract.createTransfer({
      seqno,
      secretKey: Buffer.from(secretKey, 'hex'),
      messages: [
        internal({
          value: String(exponentToNumber(withdrawableBalance)),
          to: config.ton.walletAddress,
          bounce: false,
        }),
      ],
    });

    await contract.send(transfer);

    this.logger.log(`Withdrawn ${withdrawableBalance} TON`);
  }
}
