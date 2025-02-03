import { ApiProperty } from '@nestjs/swagger';

export class ResGetSessionDto {
  @ApiProperty({
    type: String,
    description: 'User ID',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'Username',
  })
  username: string;
}
