import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { Merchant } from 'src/_entities/merchant.entity';

export const MerchantData = createParamDecorator(
  async (_: unknown, ctx: ExecutionContext): Promise<Merchant> => {
    const request = ctx.switchToHttp().getRequest();

    return request.merchant;
  },
);
