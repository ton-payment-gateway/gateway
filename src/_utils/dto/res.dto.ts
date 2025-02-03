import { ApiProperty } from '@nestjs/swagger';

export class ResDto {
  @ApiProperty({
    type: Boolean,
    description: 'Success status',
  })
  success: boolean;

  @ApiProperty({
    type: String,
    description: 'Status message',
  })
  message: string;
}
