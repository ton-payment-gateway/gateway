import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class IdDto {
  @ApiProperty({
    description: 'Id',
    type: String,
  })
  @IsUUID()
  id: string;
}
