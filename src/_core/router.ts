export const ROUTER = {
  BASE: 'api',
  AUTH: {
    LOGIN: 'login',
    REGISTER: 'register',
    REFRESH: 'refresh',
    SESSION: 'session',
  },
  USER: {
    UPDATE_PASSWORD: 'password',
  },
  MERCHANT: {
    CREATE: '',
    GET_ALL: '',
    GET_ONE: ':id',
    UPDATE: ':id',
    DELETE: ':id',
    COLLECT_ADDRESSES: ':id/collect-addresses',
    WITHDRAW: ':id/withdraw',
  },
  TRANSACTION: {
    GET_ALL: '',
    GET_ONE: ':id',
  },
  API_KEY: {
    CREATE: '',
    GET_ALL: '',
    GET_ONE: ':id',
    DELETE: ':id',
  },
  ADDRESS: {
    CREATE: '',
  },
  WEBHOOK: 'webhook',
};
