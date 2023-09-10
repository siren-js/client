import { transformAndValidate } from 'class-transformer-validator';
import { mock } from 'jest-mock-extended';

import { expectValidationError } from '../../test/helpers';
import { SirenElementVisitor } from '../visitor';
import { EmbeddedLink } from './embedded-link';

describe('EmbeddedLink', () => {
  it('should validate known properties', async () => {
    const link = { class: 69, title: 70, type: 'foo' };

    await expect(transformAndValidate(EmbeddedLink, link)).rejects.toEqual(
      expect.arrayContaining([
        expectValidationError('rel', ['isArray', 'arrayMinSize', 'isString']),
        expectValidationError('href', ['matches']),
        expectValidationError('class', ['isArray', 'isString']),
        expectValidationError('title', ['isString']),
        expectValidationError('type', ['isMimeType'])
      ])
    );
  });

  const rel = ['self'];
  const href = 'http://example.com';

  it('should default class and type properties', async () => {
    await expect(transformAndValidate(EmbeddedLink, { rel, href })).resolves.toMatchObject({ class: [] });
  });

  it('should allow unknown properties', async () => {
    const link = { rel, href, hreflang: 'en-US' };

    const result = await transformAndValidate(EmbeddedLink, link);

    expect(result).toBeInstanceOf(EmbeddedLink);
    expect(result).toMatchObject(link);
  });

  it('should require at least one rel', async () => {
    const link = { rel: [], href };

    await expect(transformAndValidate(EmbeddedLink, link)).rejects.toStrictEqual([
      expectValidationError('rel', ['arrayMinSize'])
    ]);
  });

  describe('accept', () => {
    const link = new EmbeddedLink();

    it('should pass itself to the visitor', async () => {
      const visitor = mock<SirenElementVisitor>();

      await link.accept(visitor);

      expect(visitor.visitEmbeddedLink).toHaveBeenCalledTimes(1);
      expect(visitor.visitEmbeddedLink).toHaveBeenCalledWith(link);
    });
  });
});
