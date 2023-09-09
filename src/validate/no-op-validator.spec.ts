import 'reflect-metadata';

import { Field } from '../models';
import { noOpValidator } from './no-op-validator';
import { PositiveValidationResult } from './validation-result';

describe('noOpValidator', () => {
  it('should always return a positive result', () => {
    const invalidField = new Field();
    invalidField.type = 'number';
    invalidField.value = 'NaN';
    expect(noOpValidator([invalidField])).toBeInstanceOf(PositiveValidationResult);
    expect(noOpValidator([new Field()])).toBeInstanceOf(PositiveValidationResult);
    expect(noOpValidator([])).toBeInstanceOf(PositiveValidationResult);
  });
});
