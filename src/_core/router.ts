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
  },
  TRANSACTION: {
    GET_ALL: '',
    GET_ONE: ':id',
  },
  API_KEY: {
    CREATE: '',
    GET: '',
    GET_ONE: ':id',
    UPDATE: ':id',
    DELETE: ':id',
  },
  ADDRESS: {
    CREATE: '',
  },
  WEBHOOK: 'webhook',
};
