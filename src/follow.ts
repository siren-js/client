import fetch from 'cross-fetch';

import { Href, isHyperlink, Target } from './utils';

export interface FollowOptions {
  /**
   * Base URL used to resolve relative URIs
   */
  baseUrl?: Href;

  /**
   * Request options
   */
  requestInit?: RequestInit;
}

/**
 * Follows `target` by making an HTTP `GET` request.
 * @param target request target
 * @param options configuration object
 * @returns HTTP response of following `target`
 */
export async function follow(target: Target, options: FollowOptions = {}): Promise<Response> {
  const input = isHyperlink(target) ? target.href : target;
  const url = new URL(input, options.baseUrl);
  return fetch(url, options.requestInit);
}
