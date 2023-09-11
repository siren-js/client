import { Action, EmbeddedEntity, EmbeddedLink, Entity, Field, Link } from '../models';
import { SirenElementVisitor } from './siren-element-visitor';

/**
 * Default (no-op) implementation of a {@linkcode SirenElementVisitor}. Extend this
 * class to avoid needing to implement every `SirenElementVisitor` method.
 */
export class DefaultSirenElementVisitor implements SirenElementVisitor {
  visitAction(_: Action): void {}
  visitEmbeddedEntity(_: EmbeddedEntity): void {}
  visitEmbeddedLink(_: EmbeddedLink): void {}
  visitEntity(_: Entity): void {}
  visitField(_: Field): void {}
  visitLink(_: Link): void {}
}
