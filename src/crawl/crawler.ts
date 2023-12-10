import { follow } from '../follow';
import { parse } from '../parse';
import { isHyperlink, Target } from '../utils';
import { SirenElementVisitor } from '../visitor';
import { PolitenessPolicy } from './politeness-policy';
import { RevisitPolicy } from './revisit-policy';
import { SelectionPolicy } from './selection-policy';

export class Crawler {
  constructor(
    private readonly politenessPolicy: PolitenessPolicy,
    private readonly revisitPolicy: RevisitPolicy,
    private readonly selectionPolicy: SelectionPolicy,
    private readonly visitor: SirenElementVisitor
  ) {}

  async crawl(entryPoint: Target): Promise<void> {
    const crawled = new Set<string>();
    const targets: Target[] = [entryPoint];
    while (targets.length > 0) {
      const [target] = targets.splice(0, 1);
      const url = targetUrl(target);
      if (!this.politenessPolicy.canCrawl(target) || (crawled.has(url) && !this.revisitPolicy.canRevisit(target)))
        continue;

      await wait(this.politenessPolicy.delay);
      const response = await follow(target);
      crawled.add(url);

      if (isParsable(response)) {
        const entity = await parse(response);
        await entity.accept(this.visitor);

        const selectedTargets = await this.selectionPolicy.selectFrom(entity);
        targets.push(...selectedTargets);
      }
    }
  }
}

const targetUrl = (target: Target): string => (isHyperlink(target) ? target.href.toString() : target.toString());

const wait = (amountMs: number) => new Promise((resolve) => setTimeout(resolve, amountMs));

const sirenMediaTypeRegExp = /^application\/vnd\.siren\+json/;

const isParsable = (response: Response): boolean => {
  const contentType = response.headers.get('Content-Type');
  return contentType != null && (sirenMediaTypeRegExp.test(contentType) || contentType.includes('json'));
};
