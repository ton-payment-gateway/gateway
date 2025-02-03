import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { SessionData } from 'src/auth/types';

export const AuthData = createParamDecorator(
  async (_: unknown, ctx: ExecutionContext): Promise<SessionData> => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);
