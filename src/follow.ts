import fetch from 'cross-fetch';

export interface Hyperlink {
  href: string | URL;
}

function isHyperlink(value: unknown): value is Hyperlink {
  return value != null && typeof value === 'object' && 'href' in value;
}

export type Target = Hyperlink | RequestInfo;

/**
 * Follows `target` by making an HTTP `GET` request. `target` can be a `RequestInfo` object or a `Hyperlink` object.
 * @param target request target
 * @param init optional HTTP request metadata
 * @returns HTTP response of following `target`
 */
export async function follow(target: Target, init?: RequestInit): Promise<Response> {
  const input = isHyperlink(target) ? target.href : target;
  return fetch(input, init);
}
