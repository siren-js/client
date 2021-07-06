import { Action, Link } from '@siren-js/core';
import { isRecord, isString } from '@siren-js/core/dist/util/type-guard';
import fetch, { Headers } from 'cross-fetch';
import { ActionLike } from './common';
import { toEntryList, toURLSearchParams } from './entry';
import { merge } from './merge';
import ClientResponse from './response';
import { isSerialization, Serializers, SerializersInit } from './serializer';

export { default as ClientResponse } from './response';

export default class Client {
  static get DEFAULT_ACCEPT_PREFERENCE() {
    return 'application/vnd.siren+json,application/json;q=0.9,*/*;q=0.8';
  }

  #headers = new Headers({
    Accept: Client.DEFAULT_ACCEPT_PREFERENCE
  });

  #serializers = new Serializers({
    'application/x-www-form-urlencoded': (action) =>
      toURLSearchParams(toEntryList(action))
    // 'multipart/form-data': (action) => '',
    // 'text/plain': (action) => ''
  });

  constructor(options?: ClientOptions) {
    if (options?.headers != null) {
      mergeHeaders(this.#headers, options.headers);
    }
    if (options?.serializers != null) {
      this.#serializers.merge(options.serializers);
    }
  }

  get headers() {
    return this.#headers;
  }

  get serializers() {
    return this.#serializers;
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

  async submit(action: ActionLike): Promise<ClientResponse> {
    const url = new URL(action.href);
    const method = action.method ?? 'GET';
    const requestInit: RequestInit = { method };
    if (action.fields != null && action.fields.length > 0) {
      if (['GET', 'DELETE'].includes(method)) {
        await this.serializeToQuery(Action.of(action), url);
      } else {
        await this.serializeToBody(Action.of(action), requestInit);
      }
    }
    return this.fetch(url.toString(), requestInit);
  }

  private async serializeToQuery(action: Action, url: URL): Promise<void> {
    const serializer = this.#serializers.get(
      'application/x-www-form-urlencoded'
    );
    if (serializer == null) {
      throw new Error(
        'No serializer found for application/x-www-form-urlencoded'
      );
    }
    const serialization = await serializer(action);
    url.search = serialization.toString();
  }

  private async serializeToBody(
    action: Action,
    requestInit: RequestInit
  ): Promise<void> {
    const mimeType = action.type ?? 'application/x-www-form-urlencoded';
    const serializer = this.#serializers.get(mimeType);
    if (serializer == null) {
      throw new Error(`No serializer found for ${mimeType}`);
    }
    const result = await serializer(Action.of(action));
    if (isSerialization(result)) {
      requestInit.body = result.body;
      if (result.contentType != null) {
        requestInit.headers = {
          'Content-Type': result.contentType
        };
      }
    } else {
      requestInit.body = result;
    }
  }
}

export interface ClientOptions {
  headers?: HeadersInit;
  serializers?: SerializersInit;
}

export type HeadersInit = Headers | [string, string][] | Record<string, string>;

function mergeHeaders(target: Headers, source: HeadersInit): void {
  merge(
    target,
    source,
    (source): source is Headers => source instanceof Headers
  );
}

function makeRequestInit(headers: Headers, init?: RequestInit): RequestInit {
  headers = new Headers(headers);
  if (init?.headers != null) {
    mergeHeaders(headers, init.headers as HeadersInit);
  }
  return { ...init, headers };
}

export type LinkLike = Pick<Link, 'href'>;

function isLinkLike(value: unknown): value is LinkLike {
  return isRecord(value) && isString(value.href);
}
