import { ApiProperty } from '@nestjs/swagger';

import { ErrorCode } from '../exception';

export class ResExceptionDto {
  @ApiProperty({ enum: ErrorCode, description: 'Custom error code' })
  errorCode: number;

  @ApiProperty({ description: 'Error message' })
  message: string;

  @ApiProperty({ description: 'Error details', required: false })
  details?: unknown;
}
