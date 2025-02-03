import { ApiProperty } from '@nestjs/swagger';

export class ResPingDto {
  @ApiProperty({
    description: 'App name',
  })
  name: string;

  @ApiProperty({
    description: 'App version',
  })
  version: string;
}
