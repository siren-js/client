import { Target } from '../utils/types';

/** [Politeness policy](https://en.wikipedia.org/wiki/Web_crawler#Politeness_policy) for a Crawler */
export interface PolitenessPolicy {
  /** Number of milliseconds to wait between requests. Use `0` to avoid waiting. */
  delay: number;

  /** @returns whether `target` can be crawled */
  canCrawl(target: Target): boolean;
}

/**
 * Default {@linkcode PolitenessPolicy} that returns `true` for all {@linkcode Target Targets}
 * and has a delay of 1,000 milliseconds.
 */
export class DefaultPolitenessPolicy implements PolitenessPolicy {
  static readonly DEFAULT_DELAY = 1000;

  constructor(readonly delay: number = DefaultPolitenessPolicy.DEFAULT_DELAY) {}

  canCrawl(_: Target) {
    return true;
  }
}
