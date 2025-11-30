import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class WithdrawMerchantDto {
  @ApiProperty({ description: 'Wallet address to withdraw to', type: String })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'Amount to withdraw', type: Number })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;
}
