import { Module } from '@nestjs/common';
import { Transaction } from 'src/_entities/transaction.entity';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  exports: [TransactionService],
  providers: [TransactionService],
})
export class TransactionModule {}
