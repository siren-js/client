import { Target } from '../utils';
import { DefaultSirenElementVisitor, SirenElementVisitor } from '../visitor';
import { Crawler } from './crawler';
import { DefaultPolitenessPolicy, PolitenessPolicy } from './politeness-policy';
import { defaultRevisitPolicy, RevisitPolicy } from './revisit-policy';
import { DefaultSelectionPolicy, SelectionPolicy } from './selection-policy';

export interface CrawlOptions {
  visitor?: SirenElementVisitor;
  selectionPolicy?: SelectionPolicy;
  revisitPolicy?: RevisitPolicy;
  politenessPolicy?: PolitenessPolicy;
}

export async function crawl(entryPoint: Target, options: CrawlOptions = {}): Promise<void> {
  const crawler = new Crawler(
    options.politenessPolicy ?? new DefaultPolitenessPolicy(),
    options.revisitPolicy ?? defaultRevisitPolicy,
    options.selectionPolicy ?? new DefaultSelectionPolicy(),
    options.visitor ?? new DefaultSirenElementVisitor()
  );
  await crawler.crawl(entryPoint);
}
