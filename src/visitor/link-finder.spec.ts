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

  describe('links', () => {
    it('should be an array', () => {
      expect(visitor.links).toBeInstanceOf(Array);
    });

    it('should be empty before visiting any links', () => {
      expect(visitor.links).toHaveLength(0);
    });
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

    it('should accumulate links across visits', () => {
      const link1 = mock<Link>();
      const link2 = mock<Link>();
      const link3 = mock<Link>();
      predicate.mockReturnValue(false).mockReturnValueOnce(true).mockReturnValueOnce(true);

      visitor.visitLink(link1);
      visitor.visitLink(link2);
      visitor.visitLink(link3);

      expect(visitor.links).toContain(link1);
      expect(visitor.links).toContain(link2);
      expect(visitor.links).not.toContain(link3);
      expect(predicate).toHaveBeenCalledTimes(3);
      expect(predicate).toHaveBeenCalledWith(link1);
      expect(predicate).toHaveBeenCalledWith(link2);
      expect(predicate).toHaveBeenCalledWith(link3);
    });
  });
});
