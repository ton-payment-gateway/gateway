import { Test, TestingModule } from '@nestjs/testing';
import { name, version } from '../../package.json';

import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('Ping', async () => {
    const res = await appController.ping();

    expect(res.name).toBe(name);
    expect(res.version).toBe(version);
  });
});
