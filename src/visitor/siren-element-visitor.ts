import { Action, EmbeddedEntity, EmbeddedLink, Entity, Field, Link } from '../models';

/**
 * [Visitor](https://en.wikipedia.org/wiki/Visitor_pattern) that handles
 * visiting Siren elements (actions, links, etc.)
 */
export interface SirenElementVisitor {
  visitAction(action: Action): void | Promise<void>;
  visitEmbeddedEntity(embeddedEntity: EmbeddedEntity): void | Promise<void>;
  visitEmbeddedLink(embeddedLink: EmbeddedLink): void | Promise<void>;
  visitEntity(entity: Entity): void | Promise<void>;
  visitField(field: Field): void | Promise<void>;
  visitLink(link: Link): void | Promise<void>;
}
