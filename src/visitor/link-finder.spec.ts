import { mock, mockClear } from 'jest-mock-extended';

import { Link } from '../models';
import { LinkFinder } from './link-finder';

describe('LinkFinder', () => {
  let visitor: LinkFinder;
  const predicate = jest.fn();

  beforeEach(() => {
    visitor = new LinkFinder(predicate);
  });

  afterEach(() => {
    mockClear(predicate);
  });

  it('should be defined', () => {
    expect(visitor).toBeDefined();
  });

  describe('visitLink', () => {
    it('should add link to links when it satisfies predicate', () => {
      const link = mock<Link>();
      predicate.mockReturnValueOnce(true);

      visitor.visitLink(link);

      expect(visitor.links).toContain(link);
      expect(predicate).toHaveBeenCalledTimes(1);
      expect(predicate).toHaveBeenCalledWith(link);
    });

    it('should ignore link when it does not satisfy predicate', () => {
      const link = mock<Link>();
      predicate.mockReturnValueOnce(false);

      visitor.visitLink(link);

      expect(visitor.links).not.toContain(link);
      expect(predicate).toHaveBeenCalledTimes(1);
      expect(predicate).toHaveBeenCalledWith(link);
    });
  });

  describe('links', () => {
    it('should be empty before visiting any links', () => {
      expect(visitor.links).toHaveLength(0);
    });

    it('should accumulate matching links across visits', () => {
      const link1 = mock<Link>();
      const link2 = mock<Link>();
      const link3 = mock<Link>();
      predicate.mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(false);

      visitor.visitLink(link1);
      visitor.visitLink(link2);
      visitor.visitLink(link3);

      expect(visitor.links).toStrictEqual([link1, link2]);
    });
  });

  describe('isEmpty', () => {
    it('should be true before visiting any links', () => {
      expect(visitor.isEmpty).toBe(true);
    });

    it('should be false after visiting a matching link', () => {
      const link = mock<Link>();
      predicate.mockReturnValueOnce(true);
      visitor.visitLink(link);

      expect(visitor.isEmpty).toBe(false);
    });
  });

  describe('reset', () => {
    it('should remove matched links', () => {
      const link = mock<Link>();
      predicate.mockReturnValueOnce(true);
      visitor.visitLink(link);
      expect(visitor.links).toHaveLength(1);

      visitor.reset();

      expect(visitor.links).toHaveLength(0);
    });
  });
});
