import { mock } from 'jest-mock-extended';

import { DefaultSirenElementVisitor } from './default-siren-element-visitor';

describe('DefaultSirenElementVisitor', () => {
  let visitor: DefaultSirenElementVisitor;

  beforeEach(() => {
    visitor = new DefaultSirenElementVisitor();
  });

  it('should be defined', () => {
    expect(visitor).toBeDefined();
  });

  describe('visitAction', () => {
    it('should do nothing', () => {
      expect(visitor.visitAction(mock())).toBeUndefined();
    });
  });

  describe('visitEmbeddedEntity', () => {
    it('should do nothing', () => {
      expect(visitor.visitEmbeddedEntity(mock())).toBeUndefined();
    });
  });

  describe('visitEmbeddedLink', () => {
    it('should do nothing', () => {
      expect(visitor.visitEmbeddedLink(mock())).toBeUndefined();
    });
  });

  describe('visitEntity', () => {
    it('should do nothing', () => {
      expect(visitor.visitEntity(mock())).toBeUndefined();
    });
  });

  describe('visitField', () => {
    it('should do nothing', () => {
      expect(visitor.visitField(mock())).toBeUndefined();
    });
  });

  describe('visitLink', () => {
    it('should do nothing', () => {
      expect(visitor.visitLink(mock())).toBeUndefined();
    });
  });
});
