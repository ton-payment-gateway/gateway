import { decryptData, encryptData } from './crypto';

import { ValueTransformer } from 'typeorm';

export const encrypt: ValueTransformer = {
  to: (v): string | number | null => {
    return v ? encryptData(v) : null;
  },
  from: (v): string | number | null => {
    return v ? decryptData(v) : null;
  },
};
