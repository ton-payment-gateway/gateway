import { JwtModule } from '@nestjs/jwt';
import { Global, Module } from '@nestjs/common';

import { TokenService } from './token.service';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [TokenService, TokenService],
  exports: [TokenService],
})
export class TokenModule {}
