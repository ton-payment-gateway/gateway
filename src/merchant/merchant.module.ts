import { Merchant } from 'src/_entities/merchant.entity';
import { MerchantController } from './merchant.controller';
import { MerchantService } from './merchant.service';
import { Module } from '@nestjs/common';
import { TonModule } from 'src/_utils/ton/ton.module';
import { TransactionModule } from 'src/transaction/transaction.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Merchant]), TonModule, TransactionModule],
  controllers: [MerchantController],
  providers: [MerchantService],
  exports: [MerchantService],
})
export class MerchantModule {}
