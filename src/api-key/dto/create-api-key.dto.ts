import { IsNotEmpty, IsString, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateApiKeyDto {
  @ApiProperty({
    type: String,
    description: 'API Key Name',
  })
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  name: string;
}
