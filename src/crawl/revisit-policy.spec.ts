import { mock } from 'jest-mock-extended';

import { defaultRevisitPolicy } from './revisit-policy';

describe('defaultRevisitPolicy', () => {
  describe('canRevisit', () => {
    it('should return false', () => {
      expect(defaultRevisitPolicy.canRevisit(mock())).toBe(false);
    });
  });
});
