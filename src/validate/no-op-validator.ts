import { PositiveValidationResult } from './validation-result';
import { Validator } from './validator';

export const noOpValidator: Validator = () => new PositiveValidationResult();
