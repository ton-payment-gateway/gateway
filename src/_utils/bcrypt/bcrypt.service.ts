import { compare, hash } from 'bcrypt';

import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptService {
  public async hashData(password: string) {
    const res = await hash(password, 10);
    return res;
  }

  public async compareHash(password: string, hash: string) {
    const res = await compare(password, hash);
    return res;
  }
}
