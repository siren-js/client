import { isString } from 'class-validator';

import { Href, Hyperlink } from './types';

export function isHref(value: unknown): value is Href {
  return value instanceof URL || isString(value);
}

export function isHyperlink(value: unknown): value is Hyperlink {
  return value != null && typeof value === 'object' && 'href' in value && isHref(value.href);
}
