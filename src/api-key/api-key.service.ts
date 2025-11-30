import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiKey } from 'src/_entities/api-key.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { ResApiKeyDto } from './dto/api-key.dto';
import { ResGetApiKeysDto } from './dto/get-api-keys.dto';
import { PaginationDto } from 'src/_utils/dto/pagination.dto';
import { NotFoundException } from 'src/_core/exception/exception';
import { apiKeyFormatter } from 'src/_utils/formatter';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeyRepo: Repository<ApiKey>,
  ) {}

  async findOne(options: FindOneOptions<ApiKey>) {
    const res = await this.apiKeyRepo.findOne(options);
    return res;
  }

  async findMany(options: FindManyOptions<ApiKey>) {
    const res = await this.apiKeyRepo.find(options);
    return res;
  }

  async save(data: ApiKey) {
    const res = await this.apiKeyRepo.save(data);
    return res;
  }

  create(data: Partial<ApiKey>) {
    const res = this.apiKeyRepo.create({
      ...data,
    });

    return res;
  }

  async delete(id: string) {
    await this.apiKeyRepo.delete(id);
  }

  async createApiKey(
    merchantId: string,
    data: CreateApiKeyDto,
  ): Promise<ResApiKeyDto> {
    const apiKey = this.create({
      ...data,
      key: uuid(),
      merchantId,
    });

    const res = await this.save(apiKey);

    return apiKeyFormatter(res);
  }

  async getAll(
    merchantId: string,
    pagination: PaginationDto,
  ): Promise<ResGetApiKeysDto> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 20;
    const skip = page === 1 ? 0 : (pagination.page - 1) * limit;
    const take = limit;
    const sort = pagination.sort || 'DESC';

    const data = await this.apiKeyRepo.findAndCount({
      where: {
        merchantId,
      },
      take,
      skip,
      order: {
        createdAt: sort,
      },
    });

    return {
      result: data[0].map(apiKeyFormatter),
      pagination: { total: data[1], page },
    };
  }

  async getOne(merchantId: string, id: string): Promise<ResApiKeyDto> {
    const res = await this.findOne({
      where: {
        id,
        merchantId,
      },
    });

    if (!res) {
      throw new NotFoundException('API key not found');
    }

    return apiKeyFormatter(res);
  }

  async deleteApiKey(merchantId: string, id: string) {
    const res = await this.findOne({
      where: {
        id,
        merchantId,
      },
    });

    if (!res) {
      throw new NotFoundException('API key not found');
    }

    await this.delete(id);
  }
}
