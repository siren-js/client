import { isRecord } from "@siren-js/core/dist/util/type-guard";

export function merge<T>(
  target: Target<T>,
  source: Source<T>,
  isTarget: (source: Source<T>) => source is Target<T>
): void {
  if (isTarget(source)) {
    source.forEach((value, name) => target.set(name, value));
  } else if (Array.isArray(source)) {
    source.forEach(([name, value]) => target.set(name, value));
  } else if (isRecord(source)) {
    Object.keys(source).forEach((name) => target.set(name, source[name]));
  }
}

export interface Target<T> {
  set(key: string, value: T): void;
  forEach(callback: (value: T, key: string) => void): void;
}

export type Source<T> = Target<T> | [string, T][] | Record<string, T>;
