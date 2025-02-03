import { Merchant } from 'src/_entities/merchant.entity';
import { ResGetSessionDto } from 'src/auth/dto/session.dto';
import { ResMerchantDto } from 'src/merchant/dto/merchant.dto';
import { User } from 'src/_entities/user.entity';

export const userFormatter = (data: User): ResGetSessionDto => ({
  id: data.id,
  username: data.username,
});

export const merchantFormatter = (data: Merchant): ResMerchantDto => ({
  id: data.id,
  name: data.name,
  webhookUrl: data.webhookUrl,
  address: data.address,
  createdAt: data.createdAt,
});
