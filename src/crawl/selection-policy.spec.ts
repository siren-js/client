import * as stubs from '../../test/stubs';
import { DefaultSelectionPolicy } from './selection-policy';

describe('DefaultSelectionPolicy', () => {
  let selectionPolicy: DefaultSelectionPolicy;

  beforeEach(() => {
    selectionPolicy = new DefaultSelectionPolicy();
  });

  describe('selectFrom', () => {
    it("should select an entity's links and embedded links", async () => {
      const result = await selectionPolicy.selectFrom(stubs.entity);

      expect(result).toHaveLength(6);
      expect(result).toContain(stubs.selfLink);
      expect(result).toContain(stubs.upLink);
      expect(result).toContain(stubs.knowsLink);
      expect(result).toContain(stubs.child1EmbeddedLink);
      expect(result).toContain(stubs.child2EmbeddedLink);
      expect(result).toContain(stubs.spouseLink);
    });
  });
});
