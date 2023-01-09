import '../../test/setup';

import { transformAndValidate } from 'class-transformer-validator';

import { expectValidationError } from '../../test/helpers';
import { Action } from './action';
import { EmbeddedEntity } from './embedded-entity';
import { EmbeddedLink } from './embedded-link';
import { Link } from './link';

describe('EmbeddedEntity', () => {
  it('should should validate known properties', async () => {
    const entity = { actions: 69, class: 70, entities: 71, links: 72, properties: 73, title: 74 };

    await expect(transformAndValidate(EmbeddedEntity, entity)).rejects.toMatchObject(
      expect.arrayContaining([
        expectValidationError('actions', ['isArray', 'arrayUnique', 'nestedValidation']),
        expectValidationError('class', ['isArray', 'isString']),
        expectValidationError('entities', ['isArray', 'nestedValidation']),
        expectValidationError('links', ['isArray', 'nestedValidation']),
        expectValidationError('properties', ['isObject']),
        expectValidationError('rel', ['isArray', 'isString']),
        expectValidationError('title', ['isString'])
      ])
    );
  });

  const rel = ['item'];

  it('should allow unknown properties', async () => {
    const entity = { rel, lang: 'en-US' };

    const result = await transformAndValidate(EmbeddedEntity, entity);

    expect(result).toBeInstanceOf(EmbeddedEntity);
    expect(result).toMatchObject(entity);
  });

  const name = 'foo';
  const href = 'http://api.example.com';

  it('should transform actions, entities, and links', async () => {
    const entity = {
      rel,
      actions: [{ name, href }],
      entities: [{ rel }, { rel, href }],
      links: [{ rel, href }]
    };

    const result = await transformAndValidate(EmbeddedEntity, entity);

    expect(result.actions).toBeDefined();
    expect(result.actions).toHaveLength(1);
    expect(result.actions?.[0]).toBeInstanceOf(Action);
    expect(result.entities).toBeDefined();
    expect(result.entities).toHaveLength(2);
    expect(result.entities?.[0]).toBeInstanceOf(EmbeddedEntity);
    expect(result.entities?.[1]).toBeInstanceOf(EmbeddedLink);
    expect(result.links).toBeDefined();
    expect(result.links).toHaveLength(1);
    expect(result.links?.[0]).toBeInstanceOf(Link);
  });

  it('should require uniue action names', async () => {
    const entity = {
      rel,
      actions: [
        { name, href },
        { name, href: 'http://api.example.io' }
      ]
    };

    await expect(transformAndValidate(EmbeddedEntity, entity)).rejects.toMatchObject([
      expectValidationError('actions', ['arrayUnique'])
    ]);
  });
});
