import { SirenElementVisitor } from '../visitor/siren-element-visitor';

/**
 * [Visitable](https://en.wikipedia.org/wiki/Visitor_pattern) element of a
 * Siren resource (entity, actions, links, etc.)
 */
export interface SirenElement {
  accept(visitor: SirenElementVisitor): Promise<void>;
}
