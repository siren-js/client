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

  get links(): Link[] {
    return this._links;
  }

  visitLink(link: Link): void {
    if (this.predicate(link)) this._links.push(link);
  }
}
