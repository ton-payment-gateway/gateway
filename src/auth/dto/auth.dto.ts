import { IsNotEmpty, IsString, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    type: String,
    description: 'Username',
  })
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    type: String,
    description: 'Password',
  })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}

export class ResAuthDto {
  @ApiProperty({
    type: String,
    description: 'Access token',
  })
  accessToken: string;

  @ApiProperty({
    type: String,
    description: 'Refresh token',
  })
  refreshToken: string;
}
