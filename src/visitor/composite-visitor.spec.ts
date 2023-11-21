import { mock } from 'jest-mock-extended';

import { Action, EmbeddedEntity, EmbeddedLink, Entity, Field, Link } from '../models';
import { CompositeVisitor } from './composite-visitor';
import { SirenElementVisitor } from './siren-element-visitor';

describe('CompositeVisitor', () => {
  let visitor1 = mock<SirenElementVisitor>();
  let visitor2 = mock<SirenElementVisitor>();
  let visitor: CompositeVisitor;

  beforeEach(() => {
    visitor = new CompositeVisitor([visitor1, visitor2]);
  });

  it('should be defined', () => {
    expect(visitor).toBeDefined();
  });

  describe('visitAction', () => {
    it('should delegate to each visitor', async () => {
      const action = mock<Action>();

      const result = await visitor.visitAction(action);

      expect(result).toBeUndefined();
      expect(visitor1.visitAction).toHaveBeenCalledTimes(1);
      expect(visitor1.visitAction).toHaveBeenCalledWith(action);
      expect(visitor2.visitAction).toHaveBeenCalledTimes(1);
      expect(visitor2.visitAction).toHaveBeenCalledWith(action);
    });
  });

  describe('visitEmbeddedEntity', () => {
    it('should delegate to each visitor', async () => {
      const embeddedEntity = mock<EmbeddedEntity>();

      const result = await visitor.visitEmbeddedEntity(embeddedEntity);

      expect(result).toBeUndefined();
      expect(visitor1.visitEmbeddedEntity).toHaveBeenCalledTimes(1);
      expect(visitor1.visitEmbeddedEntity).toHaveBeenCalledWith(embeddedEntity);
      expect(visitor2.visitEmbeddedEntity).toHaveBeenCalledTimes(1);
      expect(visitor2.visitEmbeddedEntity).toHaveBeenCalledWith(embeddedEntity);
    });
  });

  describe('visitEmbeddedLink', () => {
    it('should delegate to each visitor', async () => {
      const embeddedLink = mock<EmbeddedLink>();

      const result = await visitor.visitEmbeddedLink(embeddedLink);

      expect(result).toBeUndefined();
      expect(visitor1.visitEmbeddedLink).toHaveBeenCalledTimes(1);
      expect(visitor1.visitEmbeddedLink).toHaveBeenCalledWith(embeddedLink);
      expect(visitor2.visitEmbeddedLink).toHaveBeenCalledTimes(1);
      expect(visitor2.visitEmbeddedLink).toHaveBeenCalledWith(embeddedLink);
    });
  });

  describe('visitEntity', () => {
    it('should delegate to each visitor', async () => {
      const entity = mock<Entity>();

      const result = await visitor.visitEntity(entity);

      expect(result).toBeUndefined();
      expect(visitor1.visitEntity).toHaveBeenCalledTimes(1);
      expect(visitor1.visitEntity).toHaveBeenCalledWith(entity);
      expect(visitor2.visitEntity).toHaveBeenCalledTimes(1);
      expect(visitor2.visitEntity).toHaveBeenCalledWith(entity);
    });
  });

  describe('visitField', () => {
    it('should delegate to each visitor', async () => {
      const field = mock<Field>();

      const result = await visitor.visitField(field);

      expect(result).toBeUndefined();
      expect(visitor1.visitField).toHaveBeenCalledTimes(1);
      expect(visitor1.visitField).toHaveBeenCalledWith(field);
      expect(visitor2.visitField).toHaveBeenCalledTimes(1);
      expect(visitor2.visitField).toHaveBeenCalledWith(field);
    });
  });

  describe('visitLink', () => {
    it('should delegate to each visitor', async () => {
      const link = mock<Link>();

      const result = await visitor.visitLink(link);

      expect(result).toBeUndefined();
      expect(visitor1.visitLink).toHaveBeenCalledTimes(1);
      expect(visitor1.visitLink).toHaveBeenCalledWith(link);
      expect(visitor2.visitLink).toHaveBeenCalledTimes(1);
      expect(visitor2.visitLink).toHaveBeenCalledWith(link);
    });
  });
});
