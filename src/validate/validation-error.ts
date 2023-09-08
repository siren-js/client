import { NegativeValidationResult } from './validation-result';

/**
 * Wraps a {@linkcode NegativeValidationResult} as an `Error`
 */
export class ValidationError extends Error {
  constructor(readonly result: NegativeValidationResult) {
    super('Validation failed');
  }
}
