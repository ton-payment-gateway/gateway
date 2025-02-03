import { AuthDto, ResAuthDto } from './dto/auth.dto';
import { ConflictException, Injectable } from '@nestjs/common';

import { BcryptService } from 'src/_utils/bcrypt/bcrypt.service';
import { ResGetSessionDto } from './dto/session.dto';
import { TokenService } from '../_utils/token/token.service';
import { UnauthorizedException } from 'src/_core/exception/exception';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly bcryptService: BcryptService,
    private readonly userService: UserService,
  ) {}

  async login(body: AuthDto): Promise<ResAuthDto> {
    const existedUser = await this.userService.findOne({
      where: { username: body.username },
    });

    console.log(existedUser);

    if (!existedUser) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isPasswordMatch = await this.bcryptService.compareHash(
      existedUser.password,
      body.password,
    );

    console.log(isPasswordMatch);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const accessToken = this.tokenService.create({
      payload: { id: existedUser.id, username: existedUser.username },
    });
    const refreshToken = this.tokenService.create({
      payload: { id: existedUser.id, username: existedUser.username },
      isRefresh: true,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(body: AuthDto): Promise<ResAuthDto> {
    const existedUser = await this.userService.findOne({
      where: { username: body.username },
    });

    if (existedUser) {
      throw new ConflictException('Username already exists');
    }

    const password = await this.bcryptService.hashData(body.password);

    const newUser = this.userService.create({
      username: body.username,
      password,
    });

    const savedUser = await this.userService.save(newUser);

    const accessToken = this.tokenService.create({
      payload: { id: savedUser.id, username: savedUser.username },
    });
    const refreshToken = this.tokenService.create({
      payload: { id: savedUser.id, username: savedUser.username },
      isRefresh: true,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(id: string): Promise<ResAuthDto> {
    const user = await this.userService.findOne({
      where: { id },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    const accessToken = this.tokenService.create({
      payload: { id: user.id, username: user.username },
    });
    const refreshToken = this.tokenService.create({
      payload: { id: user.id, username: user.username },
      isRefresh: true,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async getSession(id: string): Promise<ResGetSessionDto> {
    const user = await this.userService.findOne({
      where: { id },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    return {
      id: user.id,
      username: user.username,
    };
  }
}
