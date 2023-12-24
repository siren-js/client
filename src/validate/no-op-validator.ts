import { PositiveValidationResult } from './validation-result';
import { Validator } from './validator';

export const noOpValidator: Validator = () => PositiveValidationResult.getInstance();
