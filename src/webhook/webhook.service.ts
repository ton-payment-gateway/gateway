import { Address } from 'ton-core';
import { AddressService } from 'src/address/address.service';
import { BaseLogger } from 'src/_core/logger/base-logger/base-logger';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { MerchantService } from 'src/merchant/merchant.service';
import { TonService } from 'src/_utils/ton/ton.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { WebhookDto } from './dto/webhook.dto';
import { constants } from 'src/_core/config/constants';

@Injectable()
export class WebhookService {
  constructor(
    private readonly logger: BaseLogger,

    private readonly transactionService: TransactionService,
    private readonly merchantService: MerchantService,
    private readonly addressService: AddressService,
    private readonly tonService: TonService,
    private readonly httpService: HttpService,
  ) {}

  async receiveNotification(body: WebhookDto) {
    this.logger.log(body, 'WebhookService.receiveNotification');

    const start = new Date().getTime();

    if (body.event_type !== 'account_tx') {
      return {
        status: 'error',
        message: 'Invalid event type',
      };
    }

    const existedTransaction = await this.transactionService.findOne({
      where: { hash: body.tx_hash },
    });

    if (existedTransaction) {
      this.logger.warn('Transaction already exists');
      return {
        status: 'error',
        message: 'Transaction already exists',
      };
    }

    const transaction = await this.tonService.getTransactionInfo(body.tx_hash);

    if (!transaction) {
      this.logger.warn('Transaction not found');
      return {
        status: 'error',
        message: 'Transaction not found',
      };
    }

    if (
      !transaction.success ||
      transaction.in_msg.bounce ||
      transaction.in_msg.bounced
    ) {
      this.logger.warn('Transaction failed');
      return {
        status: 'error',
        message: 'Transaction failed',
      };
    }

    const transactionReadableAddress = Address.parseRaw(
      transaction.in_msg.destination.address,
    ).toString({
      bounceable: false,
    });

    const merchant = await this.merchantService.findOne({
      where: { address: transactionReadableAddress },
    });

    const address = await this.addressService.findOne({
      where: { address: transactionReadableAddress },
      relations: ['merchant'],
    });

    if (!merchant && !address) {
      this.logger.warn('Merchant or Address not found');
      return {
        status: 'error',
        message: 'Merchant or Address not found',
      };
    }

    const amount = Number(transaction.in_msg.value) / 10 ** 9;

    if (amount < 0) {
      this.logger.warn('Amount less than 0');
      return {
        status: 'error',
        message: 'Amount less than 0',
      };
    }

    let transactionEntity = this.transactionService.create({
      amount: String(amount),
      serviceFee: String(constants.userFee),
      hash: body.tx_hash,
      metadata: 'Merchant deposit',
      merchantId: merchant?.id,
    });

    if (address) {
      transactionEntity.confirmationTime = new Date().getTime() - start;
      transactionEntity.merchantId = address.merchantId;
      transactionEntity.metadata = address.metadata || '';
      transactionEntity.isDirectDeposit = true;
    }

    transactionEntity = await this.transactionService.save(transactionEntity);

    this.logger.log(`Transaction ${transactionEntity.id} created`);

    if (address && address.merchant.webhookUrl) {
      try {
        this.logger.log(`Sending webhook to ${address.merchant.webhookUrl}`);
        const res = await this.httpService.axiosRef.post(
          address.merchant.webhookUrl,
          transactionEntity,
          {
            headers: { Authorization: `Bearer ${address.merchant.secretKey}` },
          },
        );
        this.logger.log(
          `Webhook sent to ${address.merchant.webhookUrl}`,
          res.data,
        );
      } catch (error) {
        this.logger.error(
          `Failed to send webhook to ${address.merchant.webhookUrl}`,
          error,
        );
      }
    }

    return {
      status: 'success',
    };
  }
}
