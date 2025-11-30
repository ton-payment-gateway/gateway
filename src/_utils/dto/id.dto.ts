import { IsNotEmpty, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class IdDto {
  @ApiProperty({
    description: 'Id',
    type: String,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
