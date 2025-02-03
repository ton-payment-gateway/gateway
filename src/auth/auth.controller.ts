import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Post, Body, Controller, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';

import { SessionData } from './types';
import { ROUTER } from '../_core/router';
import { ResExceptionDto } from '../_core/exception/dto/exception.dto';

import { HttpAuthGuard } from './guards/http-auth.guard';
import { AuthData } from '../_utils/decorators/auth-data.decorator';
import { ResGetSessionDto } from './dto/session.dto';
import { AuthDto, ResAuthDto } from './dto/auth.dto';
import { ResponseMessage } from 'src/_utils/decorators/response-message.decorator';

@ApiResponse({
  status: 400,
  description: 'Error',
  type: ResExceptionDto,
})
@ApiResponse({
  status: 422,
  type: ResExceptionDto,
  description: 'Validate error',
})
@ApiResponse({
  status: 401,
  type: ResExceptionDto,
  description: 'Authorization denied error',
})
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(ROUTER.AUTH.LOGIN)
  @ApiResponse({
    status: 200,
    type: ResAuthDto,
    description: 'Success',
  })
  @ApiOperation({ summary: 'Login' })
  @ResponseMessage('Login success')
  async login(@Body() body: AuthDto): Promise<ResAuthDto> {
    return this.authService.login(body);
  }

  @Post(ROUTER.AUTH.REGISTER)
  @ApiResponse({
    status: 200,
    type: ResAuthDto,
    description: 'Success',
  })
  @ApiOperation({ summary: 'Register' })
  @ResponseMessage('Register success')
  async register(@Body() body: AuthDto): Promise<ResAuthDto> {
    return this.authService.register(body);
  }

  @Post(ROUTER.AUTH.REFRESH)
  @ApiResponse({
    status: 200,
    type: ResAuthDto,
    description: 'Success',
  })
  @ApiBearerAuth()
  @UseGuards(HttpAuthGuard({ isRefresh: true }))
  @ApiOperation({ summary: 'Refresh token' })
  @ResponseMessage('Refresh token success')
  async refresh(@AuthData() data: SessionData): Promise<ResAuthDto> {
    return this.authService.refresh(data.id);
  }

  @Post(ROUTER.AUTH.SESSION)
  @ApiResponse({
    status: 200,
    type: ResGetSessionDto,
    description: 'Success',
  })
  @ApiBearerAuth()
  @UseGuards(HttpAuthGuard())
  @ApiOperation({ summary: 'Get user session' })
  @ResponseMessage('Get session success')
  async getSession(@AuthData() data: SessionData): Promise<ResGetSessionDto> {
    return this.authService.getSession(data.id);
  }
}
