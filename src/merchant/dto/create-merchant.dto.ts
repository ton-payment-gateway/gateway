import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  Validate,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { IsNotIpOrLocalhostConstraint } from 'src/_utils/validators/url.validator';

export class CreateMerchantDto {
  @ApiProperty({
    description: 'Name',
    type: String,
  })
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
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
