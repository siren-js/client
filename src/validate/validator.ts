import { Field } from '../models';
import { ValidationResult } from './validation-result';

/**
 * @returns a {@linkcode ValidationResult} indicating the validity of the given `fields`
 */
export type Validator = (fields: Field[]) => ValidationResult;
