import fetch from 'cross-fetch';

import { Action } from './models/action';
import { defaultSerializer } from './serialize/default-serializer';
import { Serializer } from './serialize/serializer';

export interface SubmitOptions {
  /**
   * Additional HTTP request options
   */
  requestInit?: RequestInit;

  /**
   * {@linkcode Serializer} used to serialize an {@link Action#fields `Action`'s `fields`}
   */
  serializer?: Serializer;
}

/**
 * Submits the given `action` by making an HTTP request according to `action`'s
 * `method` and `href`. If `fields` are present in `action`, they are serialized
 * according to `options.serializer` using `action.type` and `action.fields`. By
 * default, a serializer supporting the following `type`s is provided:
 * - `application/x-www-form-urlencoded`
 * - `multipart/form-data`
 * - `text/plain`
 * If `action.method` is `'GET'` or `'DELETE'`, the serialized content is placed
 * in the query string. Otherwise, the content is placed in the request body.
 * @param action Siren `Action` to submit
 * @param options Submission configuration
 * @returns `Promise` that fulfills with an HTTP `Response` object
 */
export async function submit(action: Action, options: SubmitOptions = {}): Promise<Response> {
  const { method, href, fields } = action;
  const target = new URL(href);
  const init: RequestInit = {
    ...options.requestInit,
    method
  };

  if (fields.length > 0) {
    const { serializer = defaultSerializer } = options;
    const serialization = await serializer(action.type, fields);

    if (init.method === 'GET' || init.method === 'DELETE') {
      target.search = serialization.content.toString();
    } else {
      init.headers = { ...init.headers, 'Content-Type': serialization.contentType };
      init.body = serialization.content;
    }
  }

  return fetch(target, init);
}
