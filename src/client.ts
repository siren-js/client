import { Action, Link } from '@siren-js/core';
import { isRecord, isString } from '@siren-js/core/dist/util/type-guard';
import fetch, { Headers } from 'cross-fetch';
import ClientResponse from './response';
import { toEntryList, toURLSearchParams } from './entry';

export { default as ClientResponse } from './response';

export default class Client {
  static get DEFAULT_ACCEPT_PREFERENCE() {
    return 'application/vnd.siren+json,application/json;q=0.9,*/*;q=0.8';
  }

  #headers = new Headers({
    Accept: Client.DEFAULT_ACCEPT_PREFERENCE
  });

  constructor(options?: ClientOptions) {
    if (options?.headers) {
      mergeHeaders(this.#headers, options.headers);
    }
  }

  get headers() {
    return this.#headers;
  }

  async fetch(input: RequestInfo, init?: RequestInit): Promise<ClientResponse> {
    const response = await fetch(input, makeRequestInit(this.headers, init));
    return new ClientResponse(response);
  }

  follow(link: LinkLike): Promise<ClientResponse> {
    return isLinkLike(link)
      ? this.fetch(link.href)
      : Promise.reject('cannot follow a link without an href');
  }

  submit(action: ActionLike): Promise<ClientResponse> {
    const entryList = toEntryList(action);
    const urlSearchParams = toURLSearchParams(entryList);
    const url = new URL(action.href);
    const method = action.method ?? 'GET';
    const requestInit: RequestInit = { method };
    if (['GET', 'DELETE'].includes(method)) {
      url.search = urlSearchParams.toString();
    } else {
      requestInit.headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      };
      requestInit.body = urlSearchParams.toString();
    }
    return this.fetch(url.toString(), requestInit);
  }
}

export interface ClientOptions {
  headers?: HeadersInit;
}

function mergeHeaders(target: Headers, source: HeadersInit): void {
  if (source instanceof Headers) {
    source.forEach((value, name) => target.set(name, value));
  } else if (Array.isArray(source)) {
    source.forEach(([name, value]) => target.set(name, value));
  } else {
    Object.keys(source).forEach((name) => target.set(name, source[name]));
  }
}

function makeRequestInit(headers: Headers, init?: RequestInit): RequestInit {
  headers = new Headers(headers);
  if (init?.headers) {
    mergeHeaders(headers, init.headers);
  }
  return { ...init, headers };
}

export type LinkLike = Pick<Link, 'href'>;
export type ActionLike = Pick<Action, 'href' | 'fields' | 'method' | 'type'>;

function isLinkLike(value: unknown): value is LinkLike {
  return isRecord(value) && isString(value.href);
}
