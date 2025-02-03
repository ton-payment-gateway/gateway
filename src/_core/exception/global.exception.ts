import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  CannotCreateEntityIdMapError,
  EntityNotFoundError,
  QueryFailedError,
} from 'typeorm';
import { Request, Response } from 'express';

import { GlobalResponseError } from './global.response.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let message =
      (exception as any)?.message?.message ||
      (exception as any)?.response?.errorMessage;
    const details = (exception as any)?.response?.details;
    let code = (exception as any)?.response?.errorCode || 'HttpException';

    Logger.error(
      message,
      (exception as any).stack,
      `${request.method} ${request.url}`,
    );

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      status = (exception as HttpException).getStatus();
    } else if (exception instanceof QueryFailedError) {
      const queryError = exception as QueryFailedError;

      // Handle unique constraint violation
      if ((queryError as any).code === '23505') {
        // PostgreSQL unique_violation
        status = HttpStatus.CONFLICT;
        message = 'Unique constraint violation';
        code = 'UNIQUE_CONSTRAINT_VIOLATION';
      } else if ((queryError as any).code === '1062') {
        // MySQL duplicate entry
        status = HttpStatus.CONFLICT;
        message = 'Duplicate entry';
        code = 'DUPLICATE_ENTRY';
      } else {
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = queryError.message;
        code = (exception as any).code;
      }
    } else if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message = (exception as EntityNotFoundError).message;
      code = (exception as any).code;
    } else if (exception instanceof CannotCreateEntityIdMapError) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message = (exception as CannotCreateEntityIdMapError).message;
      code = (exception as any).code;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    response
      .status(status)
      .json(GlobalResponseError(status, message, code, request, details));
  }
}
