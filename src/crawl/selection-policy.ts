import { EmbeddedLink, Entity, Link } from '../models';
import { Target } from '../utils';
import { DefaultSirenElementVisitor } from '../visitor';

/** [Selection policy](https://en.wikipedia.org/wiki/Web_crawler#Selection_policy) for a Crawler */
export interface SelectionPolicy {
  /** Selects targets from the given {@linkcode Entity} to crawl */
  selectFrom(entity: Entity): Promise<Target[]>;
}

/**
 * Default {@linkcode SelectionPolicy} that collects all the {@linkcode Link}s and
 * {@linkcode EmbeddedLink}s in an {@linkcode Entity}
 */
export class DefaultSelectionPolicy extends DefaultSirenElementVisitor implements SelectionPolicy {
  private urls: Target[] = [];

  visitEmbeddedLink(link: EmbeddedLink): void {
    this.urls.push(link);
  }

  visitLink(link: Link): void {
    this.urls.push(link);
  }

  async selectFrom(entity: Entity): Promise<Target[]> {
    this.urls = [];
    await entity.accept(this);
    return this.urls;
  }
}
