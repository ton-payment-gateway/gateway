import { Address } from 'src/_entities/address.entity';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { ApiKeyModule } from 'src/api-key/api-key.module';
import { MerchantModule } from 'src/merchant/merchant.module';
import { Module } from '@nestjs/common';
import { TonModule } from 'src/_utils/ton/ton.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Address]),
    TonModule,
    ApiKeyModule,
    MerchantModule,
  ],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}
