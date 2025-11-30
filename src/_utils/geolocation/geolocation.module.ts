import { GeolocationService } from './geolocation.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: async () => ({
        baseURL: 'https://ipapi.co',
        timeout: 100000,
        maxRedirects: 10,
      }),
    }),
  ],
  controllers: [],
  providers: [GeolocationService],
  exports: [GeolocationService],
})
export class GeolocationModule {}
