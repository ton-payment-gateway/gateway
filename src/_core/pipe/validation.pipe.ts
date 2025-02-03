import { ValidationError, ValidatorOptions } from 'class-validator';

import { ValidateException } from '../exception/exception';

interface ValidationPipeOptions extends ValidatorOptions {
  transform?: boolean;
  exceptionFactory?: (errors: ValidationError[]) => any;
}

export const ValidationPipeOptions: ValidationPipeOptions = {
  transform: true,
  exceptionFactory: (errors: ValidationError[]) => {
    // Making validation exceptions more convenient
    const errorList = errors.map((ve) => {
      const error = !!ve.constraints
        ? ve.constraints
        : ve.children.map((ve) => ve.children);

      return {
        field: ve.property,
        error,
      };
    });

    throw new ValidateException(errorList);
  },
};
