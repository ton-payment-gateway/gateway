import { Test, TestingModule } from '@nestjs/testing';

import { BcryptService } from './bcrypt.service';
import { ConfigModule } from '../../_core/config/config.module';

describe('BcryptService', () => {
  let hash: string;
  let service: BcryptService;
  const password = 'test@test';

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [BcryptService],
    }).compile();

    service = module.get<BcryptService>(BcryptService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Hash data', async () => {
    const res = await service.hashData(password);
    hash = res;

    expect(typeof res).toBe('string');
  });

  it('Compare hash success', async () => {
    const status = await service.compareHash(hash, password);

    expect(status).toBe(true);
  });

  it('Compare hash failed', async () => {
    const status = await service.compareHash(hash, password + 1);

    expect(status).toBe(false);
  });
});
