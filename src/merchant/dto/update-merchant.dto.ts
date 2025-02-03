import {
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  Validate,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { IsNotIpOrLocalhostConstraint } from 'src/_utils/validators/url.validator';

export class UpdateMerchantDto {
  @ApiProperty({
    description: 'Name',
    type: String,
  })
  @IsString()
  @MinLength(3)
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Webhook URL',
    type: String,
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  @Validate(IsNotIpOrLocalhostConstraint)
  webhookUrl: string;
}
