import { Module } from '@nestjs/common';
import { TypeOrmModule as NestTypeOrmModule } from '@nestjs/typeorm';

import { typeOrmOptios } from './typeOrm.config';

@Module({
  imports: [
    NestTypeOrmModule.forRootAsync({
      useFactory: () => typeOrmOptios,
    }),
  ],
  exports: [NestTypeOrmModule],
})
export class TypeOrmModule {}
