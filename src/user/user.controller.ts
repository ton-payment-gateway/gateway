import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { ROUTER } from 'src/_core/router';
import { ResExceptionDto } from 'src/_core/exception/dto/exception.dto';
import { ResponseMessage } from 'src/_utils/decorators/response-message.decorator';
import { UserService } from './user.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { HttpAuthGuard } from 'src/auth/guards/http-auth.guard';
import { AuthData } from 'src/_utils/decorators/auth-data.decorator';
import { SessionData } from 'src/auth/types';

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
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put(ROUTER.USER.UPDATE_PASSWORD)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiBearerAuth()
  @UseGuards(HttpAuthGuard())
  @ResponseMessage('Update password success')
  async updatePassword(
    @Body() body: UpdatePasswordDto,
    @AuthData() session: SessionData,
  ): Promise<void> {
    return this.userService.updatePassword(session.id, body);
  }
}
