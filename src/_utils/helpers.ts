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

export const exponentToNumber = (x: number | string) => {
  if (Math.abs(Number(x)) < 1.0) {
    const e = parseInt(x.toString().split('e-')[1]);
    if (e) {
      x = Number(x) * Math.pow(10, e - 1);

      x = '0.' + new Array(e).join('0') + x.toString().substring(2);
    }
  } else {
    let e = parseInt(x.toString().split('+')[1]);
    if (e > 20) {
      e -= 20;
      x = Number(x) / Math.pow(10, e);
      x = Number(x) + new Array(e + 1).join('0');
    }
  }
  return x;
};
