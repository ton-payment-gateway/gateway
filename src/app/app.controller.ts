import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { name, version } from '../../package.json';

import { ResPingDto } from './dto/ping.dto';
import { ResponseMessage } from '../../src/_utils/decorators/response-message.decorator';

@ApiTags('Ping')
@Controller()
export class AppController {
  @Get(['', 'ping', 'api/ping'])
  @ApiResponse({
    status: 200,
    type: ResPingDto,
    description: 'Success',
  })
  @ApiOperation({
    summary: 'Ping',
  })
  @ResponseMessage('Pong')
  async ping(): Promise<ResPingDto> {
    const res = {
      name,
      version,
    };

    return res;
  }
}
