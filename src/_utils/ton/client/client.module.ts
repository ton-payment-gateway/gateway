import { ClientService } from './client.service';
import { Module } from '@nestjs/common';

@Module({
  exports: [ClientService],
  providers: [ClientService],
})
export class ClientModule {}
