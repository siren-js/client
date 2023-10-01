import 'reflect-metadata';

import { Field } from '../models';
import { ActionFiller } from './action-filler';

describe('ActionFiller', () => {
  let visitor: ActionFiller;

  beforeEach(() => {
    visitor = new ActionFiller({});
  });

  it('should be defined', () => {
    expect(visitor).toBeDefined();
  });

  describe('visitField', () => {
    const name = 'foo';
    const value = 'bar';

    beforeEach(() => {
      visitor.values[name] = value;
    });

    it('should set value of matching field', () => {
      const field = new Field();
      field.name = name;

      visitor.visitField(field);

      expect(field.value).toBe(value);
    });

    it('should do nothing to an unmatched field', () => {
      const field = new Field();
      field.name = `${name}-2`;

      visitor.visitField(field);

      expect(field.value).not.toBe(value);
      expect(field.value).toBeUndefined();
    });
  });
});
