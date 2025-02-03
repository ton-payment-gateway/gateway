import { HttpException, HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  InternalServerError = 'internal_server_error',
  DataValidate = 'validate_error',
  NotFound = 'not_found_error',
  Forbidden = 'forbidden_error',
  Unauthorized = 'unauthorized_error',
  BadException = 'bad_exception_error',
  ServiceUnavailable = 'service_unavailable',
}

// Custom exception
export class Exception extends HttpException {
  constructor(
    errorCode: string,
    message: string,
    httpStatus = HttpStatus.BAD_REQUEST,
    details: any = null,
  ) {
    super(
      {
        errorMessage: message,
        errorCode,
        details,
      },
      httpStatus,
    );
  }
}

export class InternalServerException extends Exception {
  constructor(details: any = null, errorMessage = 'Internal server problem') {
    super(
      ErrorCode.InternalServerError,
      errorMessage,
      HttpStatus.INTERNAL_SERVER_ERROR,
      details,
    );
  }
}

export class ValidateException extends Exception {
  constructor(details: any = null, message = 'Validation error') {
    super(ErrorCode.DataValidate, message, HttpStatus.BAD_REQUEST, details);
  }
}

export class NotFoundException extends Exception {
  constructor(details: any = null, message = 'Not found') {
    super(ErrorCode.NotFound, message, HttpStatus.NOT_FOUND, details);
  }
}

export class IsExistsException extends Exception {
  constructor(details: any = null, message = 'Already exists') {
    super(ErrorCode.Forbidden, message, HttpStatus.FORBIDDEN, details);
  }
}

export class UnauthorizedException extends Exception {
  constructor(details: any = null, message = 'Authorization denied error') {
    super(ErrorCode.Unauthorized, message, HttpStatus.UNAUTHORIZED, details);
  }
}

export class BadException extends Exception {
  constructor(details: any = null, message = 'Error') {
    super(ErrorCode.BadException, message, HttpStatus.BAD_REQUEST, details);
  }
}

export class ForbiddenException extends Exception {
  constructor(details: any = null, message = 'Error') {
    super(ErrorCode.Forbidden, message, HttpStatus.FORBIDDEN, details);
  }
}

export class HealthCheckException extends Exception {
  constructor(details: any = null, message = 'Service unavailable') {
    super(
      ErrorCode.ServiceUnavailable,
      message,
      HttpStatus.SERVICE_UNAVAILABLE,
      details,
    );
  }
}
