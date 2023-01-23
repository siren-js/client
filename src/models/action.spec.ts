import '../../test/setup';

import { transformAndValidate } from 'class-transformer-validator';

import { expectValidationError } from '../../test/helpers';
import { Action } from './action';
import { Field } from './field';

describe('Action', () => {
  it('should validate known properties', async () => {
    const action = { class: 69, title: 70, type: 'foo', method: 71, fields: 'bar' };

    await expect(transformAndValidate(Action, action)).rejects.toEqual(
      expect.arrayContaining([
        expectValidationError('name', ['isString']),
        expectValidationError('href', ['matches']),
        expectValidationError('class', ['isArray', 'isString']),
        expectValidationError('title', ['isString']),
        expectValidationError('type', ['isMimeType']),
        expectValidationError('method', ['isString']),
        expectValidationError('fields', ['isArray', 'arrayUnique', 'nestedValidation'])
      ])
    );
  });

  const name = 'add-item';
  const href = 'http://example.com';

  it('should default method, type, class, and fields properties', async () => {
    await expect(transformAndValidate(Action, { name, href })).resolves.toMatchObject({
      method: 'GET',
      type: 'application/x-www-form-urlencoded',
      class: [],
      fields: []
    });
  });

  it('should allow extension properties', async () => {
    const action = { name, href, encoding: 'UTF-16' };

    await expect(transformAndValidate(Action, action)).resolves.toMatchObject(action);
  });

  it('should transform fields', async () => {
    const action = { name, href, fields: [{ name: 'foo' }] };

    const result = await transformAndValidate(Action, action);

    expect(result.fields).toBeDefined();
    expect(result.fields).toHaveLength(1);
    expect(result.fields?.[0]).toBeInstanceOf(Field);
  });

  it('should require unique field names', async () => {
    const action = { name, href, fields: [{ name: 'foo' }, { name: 'foo' }] };

    await expect(transformAndValidate(Action, action)).rejects.toStrictEqual([
      expectValidationError('fields', ['arrayUnique'])
    ]);
  });
});
