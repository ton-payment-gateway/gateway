import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const MerchantIdData = createParamDecorator(
  async (_: unknown, ctx: ExecutionContext): Promise<string> => {
    const request = ctx.switchToHttp().getRequest();

    return request.merchantId;
  },
);
