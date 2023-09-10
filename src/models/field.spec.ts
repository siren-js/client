import { transformAndValidate } from 'class-transformer-validator';
import { mock } from 'jest-mock-extended';

import { expectValidationError } from '../../test/helpers';
import { SirenElementVisitor } from '../visitor';
import { Field } from './field';

describe('Field', () => {
  it('should validate known properties', async () => {
    const field = { class: 69, title: 70, type: 71 };

    await expect(transformAndValidate(Field, field)).rejects.toEqual(
      expect.arrayContaining([
        expectValidationError('name', ['isString']),
        expectValidationError('class', ['isArray', 'isString']),
        expectValidationError('title', ['isString']),
        expectValidationError('type', ['isString'])
      ])
    );
  });

  const name = 'foo';

  it('should default class and type properties', async () => {
    await expect(transformAndValidate(Field, { name })).resolves.toMatchObject({ class: [], type: 'text' });
  });

  it('should allow unknown properties', async () => {
    const field = { name, min: 1, step: '2' };

    const result = await transformAndValidate(Field, field);

    expect(result).toBeInstanceOf(Field);
    expect(result).toMatchObject(field);
  });

  describe('accept', () => {
    const field = new Field();

    it('should pass itself to the visitor', async () => {
      const visitor = mock<SirenElementVisitor>();

      await field.accept(visitor);

      expect(visitor.visitField).toHaveBeenCalledTimes(1);
      expect(visitor.visitField).toHaveBeenCalledWith(field);
    });
  });
});
