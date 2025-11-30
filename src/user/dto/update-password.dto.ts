import { IsNotEmpty, IsString, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({
    type: String,
    description: 'Old password',
  })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    type: String,
    description: 'New password',
  })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  newPassword: string;
}
