import { BaseLogger } from '../../_core/logger/base-logger/base-logger';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GeolocationService {
  constructor(
    private readonly logger: BaseLogger,
    private readonly httpService: HttpService,
  ) {}

  async getUserCountry(ipAddress: string): Promise<string | null> {
    try {
      const response = await this.httpService.axiosRef.get(
        `${ipAddress}/country`,
      );

      this.logger.log(`Fetched country for IP ${ipAddress}: ${response.data}`);

      return response.data;
    } catch (error) {
      this.logger.error('Error fetching user country:', error);
      return null;
    }
  }
}
