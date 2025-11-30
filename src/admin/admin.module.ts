import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Module } from '@nestjs/common';
import { TokenModule } from 'src/_utils/token/token.module';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  imports: [TokenModule, TransactionModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
