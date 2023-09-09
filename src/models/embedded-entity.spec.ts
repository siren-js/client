import { transformAndValidate } from 'class-transformer-validator';
import { mock } from 'jest-mock-extended';

import { expectValidationError } from '../../test/helpers';
import { action, embeddedEntity } from '../../test/stubs';
import { SirenElementVisitor } from '../visitor';
import { Action } from './action';
import { EmbeddedEntity } from './embedded-entity';
import { EmbeddedLink } from './embedded-link';
import { Link } from './link';

describe('EmbeddedEntity', () => {
  it('should should validate known properties', async () => {
    const entity = { actions: 69, class: 70, entities: 71, links: 72, properties: 73, title: 74 };

    await expect(transformAndValidate(EmbeddedEntity, entity)).rejects.toEqual(
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

  it('should default actions, class, entities, and links properties', async () => {
    await expect(transformAndValidate(EmbeddedEntity, { rel })).resolves.toMatchObject({
      actions: [],
      class: [],
      entities: [],
      links: []
    });
  });

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

    expect(result.actions).toHaveLength(1);
    expect(result.actions[0]).toBeInstanceOf(Action);
    expect(result.entities).toHaveLength(2);
    expect(result.entities[0]).toBeInstanceOf(EmbeddedEntity);
    expect(result.entities[1]).toBeInstanceOf(EmbeddedLink);
    expect(result.links).toHaveLength(1);
    expect(result.links[0]).toBeInstanceOf(Link);
  });

  it('should require uniue action names', async () => {
    const entity = {
      rel,
      actions: [
        { name, href },
        { name, href: 'http://api.example.io' }
      ]
    };

    await expect(transformAndValidate(EmbeddedEntity, entity)).rejects.toStrictEqual([
      expectValidationError('actions', ['arrayUnique'])
    ]);
  });

  describe('accept', () => {
    it('should pass itself to the visitor', async () => {
      const entity = new EmbeddedEntity();
      const visitor = mock<SirenElementVisitor>();

      await entity.accept(visitor);

      expect(visitor.visitEntity).toHaveBeenCalledTimes(1);
      expect(visitor.visitEntity).toHaveBeenCalledWith(entity);
    });

    it('should pass the visitor to each action', async () => {
      const entity = new EmbeddedEntity();
      entity.actions = [mock<Action>(), mock<Action>()];
      const visitor = mock<SirenElementVisitor>();

      await entity.accept(visitor);

      entity.actions.forEach((action) => {
        expect(action.accept).toHaveBeenCalledTimes(1);
        expect(action.accept).toHaveBeenCalledWith(visitor);
      });
    });

    it('should pass the visitor to each sub-entity', async () => {
      const entity = new EmbeddedEntity();
      entity.entities = [mock<EmbeddedEntity>(), mock<EmbeddedLink>()];
      const visitor = mock<SirenElementVisitor>();

      await entity.accept(visitor);

      entity.entities.forEach((subEntity) => {
        expect(subEntity.accept).toHaveBeenCalledTimes(1);
        expect(subEntity.accept).toHaveBeenCalledWith(visitor);
      });
    });

    it('should pass the visitor to each action', async () => {
      const entity = new EmbeddedEntity();
      entity.links = [mock<Link>(), mock<Link>()];
      const visitor = mock<SirenElementVisitor>();

      await entity.accept(visitor);

      entity.links.forEach((link) => {
        expect(link.accept).toHaveBeenCalledTimes(1);
        expect(link.accept).toHaveBeenCalledWith(visitor);
      });
    });
  });

  describe('getAction', () => {
    it('should return undefined when no Field with the given name exists', () => {
      const result = embeddedEntity.getAction('not-the-action-you-are-looking-for');

      expect(result).toBeUndefined();
    });

    it('should return Field with the given name', () => {
      const result = embeddedEntity.getAction(action.name);

      expect(result).toBe(action);
    });
  });
});
