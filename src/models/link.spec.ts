import { transformAndValidate } from 'class-transformer-validator';
import { mock } from 'jest-mock-extended';

import { expectValidationError } from '../../test/helpers';
import { SirenElementVisitor } from '../visitor';
import { Link } from './link';

describe('Link', () => {
  it('should validate known properties', async () => {
    const link = { class: 69, title: 70, type: 'foo' };

    await expect(transformAndValidate(Link, link)).rejects.toEqual(
      expect.arrayContaining([
        expectValidationError('rel', ['isArray', 'isString']),
        expectValidationError('href', ['matches']),
        expectValidationError('class', ['isArray', 'isString']),
        expectValidationError('title', ['isString']),
        expectValidationError('type', ['isMimeType'])
      ])
    );
  });

  const rel = ['self'];
  const href = 'http://example.com';

  it('should default class property', async () => {
    await expect(transformAndValidate(Link, { rel, href })).resolves.toMatchObject({ class: [] });
  });

  it('should allow unknown properties', async () => {
    const link = {
      rel,
      href,
      hreflang: 'en-US',
      media: 'screen and (color)'
    };

    const result = await transformAndValidate(Link, link);

    expect(result).toBeInstanceOf(Link);
    expect(result).toMatchObject(link);
  });

  describe('accept', () => {
    const link = new Link();

    it('should pass itself to the visitor', async () => {
      const visitor = mock<SirenElementVisitor>();

      await link.accept(visitor);

      expect(visitor.visitLink).toHaveBeenCalledTimes(1);
      expect(visitor.visitLink).toHaveBeenCalledWith(link);
    });
  });
});
