import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/_entities/transaction.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) {}

  async findOne(options: FindOneOptions<Transaction>) {
    const res = await this.transactionRepo.findOne(options);
    return res;
  }

  async findMany(options: FindManyOptions<Transaction>) {
    const res = await this.transactionRepo.find(options);
    return res;
  }

  async save(data: Transaction) {
    const res = await this.transactionRepo.save(data);
    return res;
  }

  create(data: Partial<Transaction>) {
    const res = this.transactionRepo.create({
      ...data,
    });

    return res;
  }

  async getBalance(merchantId: string) {
    const res: { balance: string } = await this.transactionRepo
      .createQueryBuilder('transaction')
      .select(
        'SUM(transaction.amount) - SUM(transaction.service_fee)',
        'balance',
      )
      .where('transaction.merchant_id = :merchantId', { merchantId })
      .getRawOne();

    return Number(res.balance);
  }
}
