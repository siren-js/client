import { mock } from 'jest-mock-extended';

import { selfLink } from '../../test/stubs';
import { isHyperlink, Target } from '../utils';
import { DefaultPolitenessPolicy } from './politeness-policy';

describe('DefaultPolitenessPolicy', () => {
  let politenessPolicy: DefaultPolitenessPolicy;

  beforeEach(() => {
    politenessPolicy = new DefaultPolitenessPolicy();
  });

  describe('delay', () => {
    it('should default to 1 second', () => {
      expect(politenessPolicy.delay).toBe(1000);
    });

    it('should be configurable', () => {
      const delay = 500;

      const policy = new DefaultPolitenessPolicy(delay);

      expect(policy.delay).toBe(delay);
    });
  });

  describe('canCrawl', () => {
    it('should return true', () => {
      expect(politenessPolicy.canCrawl(mock())).toBe(true);
    });
  });

  it('should support extending', () => {
    class FooPolitenessPolicy extends DefaultPolitenessPolicy {
      constructor(delay: number = DefaultPolitenessPolicy.DEFAULT_DELAY) {
        // override delay by passing it to the parent constructor
        super(delay);
      }

      // override canCrawl like you would any other method
      canCrawl(target: Target): boolean {
        return isHyperlink(target);
      }
    }
    const delay = 5000;

    const policy = new FooPolitenessPolicy(delay);

    expect(policy.delay).toBe(delay);
    expect(policy.canCrawl(selfLink.href)).toBe(false);
    expect(policy.canCrawl(selfLink)).toBe(true);
  });
});
