import '../../test/setup';

import { transformAndValidate } from 'class-transformer-validator';

import { expectValidationError } from '../../test/helpers';
import { Link } from './link';

describe('Link', () => {
  it('should validate known properties', async () => {
    const link = { class: 69, title: 70, type: 'foo' };

    await expect(transformAndValidate(Link, link)).rejects.toMatchObject(
      expect.arrayContaining([
        expectValidationError('rel', ['isArray', 'isString']),
        expectValidationError('href', ['matches']),
        expectValidationError('class', ['isArray', 'isString']),
        expectValidationError('title', ['isString']),
        expectValidationError('type', ['isMimeType'])
      ])
    );
  });

  it('should allow unknown properties', async () => {
    const link = {
      rel: ['self'],
      href: 'http://example.com',
      hreflang: 'en-US',
      media: 'screen and (color)'
    };

    const result = await transformAndValidate(Link, link);

    expect(result).toBeInstanceOf(Link);
    expect(result).toMatchObject(link);
  });
});
