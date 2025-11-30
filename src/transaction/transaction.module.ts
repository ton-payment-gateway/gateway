import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { Transaction } from 'src/_entities/transaction.entity';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from 'src/_core/config/configuration';

const config = configuration();

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    HttpModule.registerAsync({
      useFactory: async () => ({
        baseURL: config.forecast.url,
        timeout: 100000,
        maxRedirects: 10,
      }),
    }),
  ],
  exports: [TransactionService],
  providers: [TransactionService],
})
export class TransactionModule {}
