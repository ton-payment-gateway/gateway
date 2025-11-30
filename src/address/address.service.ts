import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/_entities/address.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import {
  CreateAddressDto,
  ResCreateAddressDto,
} from './dto/create-address.dto';
import { TonService } from 'src/_utils/ton/ton.service';
import { addressFormatter } from 'src/_utils/formatter';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,

    private readonly tonService: TonService,
  ) {}

  async findOne(options: FindOneOptions<Address>) {
    const res = await this.addressRepo.findOne(options);
    return res;
  }

  async findMany(options: FindManyOptions<Address>) {
    const res = await this.addressRepo.find(options);
    return res;
  }

  async save(data: Address) {
    const res = await this.addressRepo.save(data);
    return res;
  }

  create(data: Partial<Address>) {
    const res = this.addressRepo.create({
      ...data,
    });

    return res;
  }

  async createAddress(
    merchantId: string,
    data: CreateAddressDto,
  ): Promise<ResCreateAddressDto> {
    const wallet = await this.tonService.createWallet();

    const address = this.create({
      ...data,
      address: wallet.readableAddress,
      keys: {
        publicKey: wallet.publicKey,
        secretKey: wallet.secretKey,
        mnemonic: wallet.mnemonic,
        walletId: wallet.walletId,
      },
      merchantId,
    });

    const res = await this.save(address);

    await this.tonService.subscribeToWallet(wallet.walletId);

    return addressFormatter(res);
  }
}
