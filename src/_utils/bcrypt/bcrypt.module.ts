import { BcryptService } from './bcrypt.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [BcryptService],
  exports: [BcryptService],
})
export class BcryptModule {}
