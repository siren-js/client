import { Target } from '../utils';

/** [Re-visit policy](https://en.wikipedia.org/wiki/Web_crawler#Re-visit_policy) for a Crawler */
export interface RevisitPolicy {
  /** @returns whether `target` can be revisited by the {@linkcode Crawler} */
  canRevisit(target: Target): boolean;
}

/** Constructs a {@linkcode RevisitPolicy} from the given predicate function */
export const revisitPolicy = (canRevisit: (target: Target) => boolean): RevisitPolicy => ({ canRevisit });

/** Default revisit policy that always returns `false` */
export const defaultRevisitPolicy = revisitPolicy(() => false);
