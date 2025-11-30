import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Merchant } from 'src/_entities/merchant.entity';
import { PaginationDto } from 'src/_utils/dto/pagination.dto';
import { merchantFormatter } from 'src/_utils/formatter';
import { SortEnum } from 'src/_utils/types';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ResGetMerchantsDto } from './dto/get-merchants.dto';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { TonService } from 'src/_utils/ton/ton.service';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { BadException, NotFoundException } from 'src/_core/exception/exception';
import { TransactionService } from 'src/transaction/transaction.service';
import { randomBytes } from 'crypto';
import { WithdrawMerchantDto } from './dto/withdraw-merchant.dto';
import { constants } from 'src/_core/config/constants';
import { BaseLogger } from 'src/_core/logger/base-logger/base-logger';

@Injectable()
export class MerchantService {
  constructor(
    @InjectRepository(Merchant)
    private readonly merchantRepo: Repository<Merchant>,

    private readonly logger: BaseLogger,

    private readonly tonService: TonService,

    private readonly transactionService: TransactionService,
  ) {}

  async findOne(options: FindOneOptions<Merchant>) {
    const res = await this.merchantRepo.findOne(options);
    return res;
  }

  async findMany(options: FindManyOptions<Merchant>) {
    const res = await this.merchantRepo.find(options);
    return res;
  }

  async findWithDeleted(options: FindManyOptions<Merchant>) {
    const res = await this.findMany({ ...options, withDeleted: true });
    return res;
  }

  async save(data: Merchant) {
    const res = await this.merchantRepo.save(data);
    return res;
  }

  create(data: Partial<Merchant>) {
    const res = this.merchantRepo.create({
      ...data,
    });

    return res;
  }

  async delete(id: string) {
    await this.merchantRepo.softDelete(id);
  }

  async getAll(
    userId: string,
    pagination: PaginationDto,
  ): Promise<ResGetMerchantsDto> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 20;
    const skip = page === 1 ? 0 : (pagination.page - 1) * limit;
    const take = limit;
    const sort = pagination.sort || SortEnum.desc;

    const data = await this.merchantRepo.findAndCount({
      where: {
        userId,
      },
      skip,
      take,
      order: {
        createdAt: sort,
      },
    });

    return {
      result: data[0].map((merchant) => merchantFormatter(merchant)),
      pagination: {
        page,
        total: data[1],
      },
    };
  }

  async getOne(merchant: Merchant) {
    const balance = await this.transactionService.getBalance(merchant.id);

    const withdrawableBalance = await this.getWithdrawableBalance(
      merchant.keys.publicKey,
    );

    return merchantFormatter(merchant, balance, withdrawableBalance);
  }

  async createMerchant(userId: string, body: CreateMerchantDto) {
    const wallet = await this.tonService.createWallet();

    const data = this.create({
      ...body,
      userId,
      address: wallet.readableAddress,
      secretKey: randomBytes(32).toString('base64'),
      keys: {
        publicKey: wallet.publicKey,
        secretKey: wallet.secretKey,
        mnemonic: wallet.mnemonic,
        walletId: wallet.walletId,
      },
    });

    await this.tonService.subscribeToWallet(wallet.walletId);

    const res = await this.save(data);

    return merchantFormatter(res, 0, 0);
  }

  async update(merchant: Merchant, body: UpdateMerchantDto) {
    merchant.name = body.name || merchant.name;
    merchant.webhookUrl = body.webhookUrl || merchant.webhookUrl;

    const res = await this.save(merchant);

    const balance = await this.transactionService.getBalance(merchant.id);

    const withdrawableBalance = await this.getWithdrawableBalance(
      merchant.keys.publicKey,
    );

    return merchantFormatter(res, balance, withdrawableBalance);
  }

  async deleteMerchant(merchant: Merchant) {
    await this.delete(merchant.id);
  }

  async withdrawAddressesToMerchant(merchantId: string) {
    const merchant = await this.findOne({
      where: {
        id: merchantId,
      },
      relations: ['addresses'],
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    for (const address of merchant.addresses) {
      await this.tonService
        .withdrawFromWallet({
          publicKey: address.keys.publicKey,
          secretKey: address.keys.secretKey,
          toAddress: merchant.address,
        })
        .then(() => {
          this.logger.log(
            `Successfully withdrew from address ${address.address} to merchant ${merchant.address}`,
          );
        })
        .catch((error) => {
          this.logger.error(
            `Failed to withdraw from address ${address.address}:`,
            error,
          );
        });
    }
  }

  async withdrawMerchant(merchantId: string, body: WithdrawMerchantDto) {
    const merchant = await this.findOne({
      where: {
        id: merchantId,
      },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    const balance = await this.transactionService.getBalance(merchant.id);

    if (body.amount > balance) {
      throw new BadException('Insufficient balance');
    }

    const withdrawableBalance = await this.getWithdrawableBalance(
      merchant.keys.publicKey,
    );

    if (body.amount > withdrawableBalance) {
      throw new BadException(
        `Amount exceeds withdrawable balance. Max withdrawable amount is ${withdrawableBalance}`,
      );
    }

    await this.transactionService.save(
      this.transactionService.create({
        amount: String(-body.amount),
        serviceFee: String(0),
        hash: `withdraw-${Date.now()}-${Math.random()}`,
        metadata: `Withdrawal to address ${body.address}`,
        merchantId: merchant.id,
      }),
    );

    await this.tonService.withdrawFromWallet({
      publicKey: merchant.keys.publicKey,
      secretKey: merchant.keys.secretKey,
      toAddress: body.address,
      amount: body.amount,
    });
  }

  async getWithdrawableBalance(publicKey: string) {
    const accountBalance = await this.tonService.getBalance(publicKey);

    const withdrawableBalance = Number(
      (accountBalance - constants.transactionFee).toFixed(9),
    );

    return withdrawableBalance > 0 ? withdrawableBalance : 0;
  }

  async callTransactionServiceMethod<K extends keyof TransactionService>(
    method: K,
    ...args: Parameters<TransactionService[K]>
  ): Promise<ReturnType<TransactionService[K]>> {
    return (this.transactionService[method] as any)(...args);
  }
}
