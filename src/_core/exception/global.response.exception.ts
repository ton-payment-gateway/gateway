import { Request } from 'express';

export const GlobalResponseError: (
  statusCode: number,
  message: string,
  code: string,
  request: Request,
  details?: any,
) => IResponseError = (
  statusCode: number,
  message: string,
  code: string,
  request: Request,
  details?: any,
): IResponseError => {
  return {
    statusCode: statusCode,
    message,
    code,
    timestamp: new Date().toISOString(),
    path: request.url,
    method: request.method,
    details,
  };
};

export interface IResponseError {
  statusCode: number;
  message: string;
  code: string;
  timestamp: string;
  path: string;
  method: string;
  details?: any;
}
