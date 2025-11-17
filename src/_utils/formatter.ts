import { Address } from 'src/_entities/address.entity';
import { Merchant } from 'src/_entities/merchant.entity';
import { ResApiKeyDto } from 'src/api-key/dto/api-key.dto';
import { ResCreateAddressDto } from 'src/address/dto/create-address.dto';
import { ResGetSessionDto } from 'src/auth/dto/session.dto';
import { ResMerchantDto } from 'src/merchant/dto/merchant.dto';
import { Transaction } from 'src/_entities/transaction.entity';
import { TransactionDto } from 'src/transaction/dto/transaction.dto';
import { User } from 'src/_entities/user.entity';

export const userFormatter = (data: User): ResGetSessionDto => ({
  id: data.id,
  username: data.username,
});

export const merchantFormatter = (
  data: Merchant,
  balance?: number,
  withdrawableBalance?: number,
): ResMerchantDto => ({
  id: data.id,
  name: data.name,
  webhookUrl: data.webhookUrl,
  balance: balance || 0,
  withdrawableBalance: withdrawableBalance || 0,
  secretKey: data.secretKey,
  createdAt: data.createdAt,
});

export const apiKeyFormatter = (data: any): ResApiKeyDto => ({
  id: data.id,
  name: data.name,
  key: data.key,
  createdAt: data.createdAt,
});

export const addressFormatter = (data: Address): ResCreateAddressDto => ({
  address: data.address,
  metadata: data.metadata,
});

export const transactionFormatter = (data: Transaction): TransactionDto => ({
  id: data.id,
  amount: Number(data.amount),
  serviceFee: Number(data.serviceFee),
  hash: data.hash,
  confirmationTime: data.confirmationTime,
  merchantId: data.merchantId,
  createdAt: data.createdAt,
});
