import '../../test/setup';

import { transformAndValidate } from 'class-transformer-validator';

import { expectValidationError } from '../../test/helpers';
import { Field } from './field';

describe('Field', () => {
  it('should validate known properties', async () => {
    const field = { class: 69, title: 70, type: 71 };

    await expect(transformAndValidate(Field, field)).rejects.toMatchObject(
      expect.arrayContaining([
        expectValidationError('name', ['isString']),
        expectValidationError('class', ['isArray', 'isString']),
        expectValidationError('title', ['isString']),
        expectValidationError('type', ['isString'])
      ])
    );
  });

  it('should allow unknown properties', async () => {
    const field = { name: 'foo', min: 1, step: '2' };

    const result = await transformAndValidate(Field, field);

    expect(result).toBeInstanceOf(Field);
    expect(result).toMatchObject(field);
  });

  it('should default type property', async () => {
    const field = { name: 'foo' };

    const result = await transformAndValidate(Field, field);

    expect(result).toBeInstanceOf(Field);
    expect(result).toMatchObject({ ...field, type: 'text' });
  });
});
