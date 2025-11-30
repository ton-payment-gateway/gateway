import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BcryptModule } from 'src/_utils/bcrypt/bcrypt.module';
import { GeolocationModule } from 'src/_utils/geolocation/geolocation.module';
import { Module } from '@nestjs/common';
import { TokenModule } from '../_utils/token/token.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TokenModule, BcryptModule, UserModule, GeolocationModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
