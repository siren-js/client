import { Action, EmbeddedEntity, EmbeddedLink, Entity, Field, Link } from '../models';
import { SirenElementVisitor } from './siren-element-visitor';

/**
 * Composes multiple {@linkcode SirenElementVisitor}s (from left to right) into a single Visitor.
 */
export class CompositeVisitor implements SirenElementVisitor {
  constructor(readonly visitors: SirenElementVisitor[]) {}

  async visitAction(action: Action): Promise<void> {
    await this.apply((visitor) => visitor.visitAction(action));
  }

  async visitEmbeddedEntity(entity: EmbeddedEntity): Promise<void> {
    await this.apply((visitor) => visitor.visitEmbeddedEntity(entity));
  }

  async visitEmbeddedLink(link: EmbeddedLink): Promise<void> {
    await this.apply((visitor) => visitor.visitEmbeddedLink(link));
  }

  async visitEntity(entity: Entity): Promise<void> {
    await this.apply((visitor) => visitor.visitEntity(entity));
  }

  async visitField(field: Field): Promise<void> {
    await this.apply((visitor) => visitor.visitField(field));
  }

  async visitLink(link: Link): Promise<void> {
    await this.apply((visitor) => visitor.visitLink(link));
  }

  private async apply(fn: (visitor: SirenElementVisitor) => void | Promise<void>) {
    return Promise.all(this.visitors.map(fn));
  }
}
