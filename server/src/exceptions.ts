import { BadRequestException, ValidationError } from '@nestjs/common';

type ErrorCode = 'SYSTEM_ERROR' | 'VALIDATION_ERROR' | 'EXTERNAL_API_ERROR';

interface ErrorResponse {
  code: string;
  message: string;
  details: string | string[] | null;
}

const errorMap = new Map<ErrorCode, Omit<ErrorResponse, 'details'>>([
  ['SYSTEM_ERROR', { code: '001', message: 'System error' }],
  ['VALIDATION_ERROR', { code: '002', message: 'Validation error' }],
  ['EXTERNAL_API_ERROR', { code: '003', message: 'External API error' }],
]);

const findAllValidationErrorConstraints = (errors: ValidationError[]): string[] =>
  errors
    .map(({ constraints, children }) =>
      !children?.length ? Object.values(constraints) : findAllValidationErrorConstraints(children).flat(),
    )
    .flat();

export class ValidationException extends BadRequestException {
  constructor(errors: ValidationError[]) {
    super(getErrorResponse('VALIDATION_ERROR', findAllValidationErrorConstraints(errors)));
  }
}

export const getErrorResponse = (code: ErrorCode, details: ErrorResponse['details'] = null) => ({
  ...errorMap.get(code),
  details,
});
