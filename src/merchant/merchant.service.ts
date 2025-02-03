import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Merchant } from 'src/_entities/merchant.entity';
import { PaginationDto } from 'src/_utils/dto/pagination.dto';
import { merchantFormatter } from 'src/_utils/formatter';
import { SortEnum } from 'src/_utils/types';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ResGetMerchantsDto } from './dto/get-merchants.dto';
import { NotFoundException } from 'src/_core/exception/exception';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { TonService } from 'src/_utils/ton/ton.service';
import { UpdateMerchantDto } from './dto/update-merchant.dto';

@Injectable()
export class MerchantService {
  constructor(
    @InjectRepository(Merchant)
    private readonly merchantRepo: Repository<Merchant>,

    private readonly tonService: TonService,
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
      result: data[0].map(merchantFormatter),
      pagination: {
        page,
        total: data[1],
      },
    };
  }

  async getOne(userId: string, id: string) {
    const data = await this.findOne({
      where: {
        userId,
        id,
      },
    });

    if (!data) {
      throw new NotFoundException('Merchant not found');
    }

    return merchantFormatter(data);
  }

  async createMerchant(userId: string, body: CreateMerchantDto) {
    const wallet = await this.tonService.createWallet();

    const data = this.create({
      ...body,
      userId,
      address: wallet.readableAddress,
      keys: {
        publicKey: wallet.publicKey,
        secretKey: wallet.secretKey,
        mnemonic: wallet.mnemonic,
        walletId: wallet.walletId,
      },
    });

    await this.tonService.subscribeToWallet(wallet.walletId);

    const res = await this.save(data);

    return merchantFormatter(res);
  }

  async update(userId: string, id: string, body: UpdateMerchantDto) {
    const data = await this.findOne({
      where: {
        userId,
        id,
      },
    });

    if (!data) {
      throw new NotFoundException('Merchant not found');
    }

    data.name = body.name || data.name;
    data.webhookUrl = body.webhookUrl || data.webhookUrl;

    const res = await this.save(data);

    return merchantFormatter(res);
  }

  async deleteMerchant(userId: string, id: string) {
    const data = await this.findOne({
      where: {
        userId,
        id,
      },
    });

    if (!data) {
      throw new NotFoundException('Merchant not found');
    }

    await this.delete(id);
  }
}
