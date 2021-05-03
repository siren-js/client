import { Action, Link } from '@siren-js/core';
import { isRecord, isString } from '@siren-js/core/dist/util/type-guard';
import fetch from 'cross-fetch';
import ClientResponse from './response';
import { toEntryList, toURLSearchParams } from './entry';

export { default as ClientResponse } from './response';

export default class Client {
  async fetch(input: RequestInfo, init?: RequestInit): Promise<ClientResponse> {
    const response = await fetch(input, init);
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

export type LinkLike = Pick<Link, 'href'>;
export type ActionLike = Pick<Action, 'href' | 'fields' | 'method' | 'type'>;

function isLinkLike(value: unknown): value is LinkLike {
  return isRecord(value) && isString(value.href);
}
