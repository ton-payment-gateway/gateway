import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import {
  HealthCheckService,
  HealthIndicatorResult,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

import { HealthCheckException } from '../_core/exception/exception';
import { ResponseMessage } from 'src/_utils/decorators/response-message.decorator';

@ApiTags('Health')
@Controller()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  private status = true;

  private async validate(
    name: string,
    check: boolean | ((name?: string) => Promise<HealthIndicatorResult>),
  ): Promise<HealthIndicatorResult> {
    if (typeof check === 'function') {
      try {
        return await check(name);
      } catch (err) {
        this.status = false;
        return err;
      }
    }

    if (check) {
      return {
        [name]: { status: 'up' },
      };
    }

    this.status = false;
    return {
      [name]: { status: 'down' },
    };
  }

  @Get('/liveness')
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Check liveness',
  })
  @ResponseMessage('Liveness check passed')
  async liveness(): Promise<void> {}

  @Get('/readiness')
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiOperation({
    summary: 'Check readiness',
  })
  @ResponseMessage('Readiness check passed')
  async readiness() {
    this.status = true;

    const details = await this.health.check([
      async () => this.validate('database', this.db.pingCheck.bind(this.db)),
    ]);

    if (!this.status) {
      throw new HealthCheckException(details);
    }

    return details;
  }
}
