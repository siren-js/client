import { isString } from 'class-validator';

export type Href = string | URL;

export function isHref(value: unknown): value is Href {
  return value instanceof URL || isString(value);
}
