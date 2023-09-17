import { Link } from '../models';
import { DefaultSirenElementVisitor } from './default-siren-element-visitor';

/**
 * Collects visited links that satisfy {@linkcode predicate}
 */
export class LinkFinder extends DefaultSirenElementVisitor {
  private _links: Link[] = [];

  constructor(private predicate: (link: Link) => boolean) {
    super();
  }

  /**
   * Indicates whether any visited links have satisfied {@linkcode predicate}
   */
  get isEmpty(): boolean {
    return this.links.length === 0;
  }

  /**
   * List of visited links that have satisfied {@linkcode predicate}
   */
  get links(): readonly Link[] {
    return Object.freeze(this._links);
  }

  /**
   * Resets this visitor, forgetting all visited links
   */
  reset() {
    this._links = [];
  }

  visitLink(link: Link): void {
    if (this.predicate(link)) this._links.push(link);
  }
}
