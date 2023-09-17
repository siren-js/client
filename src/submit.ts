import { fetch, Headers } from 'cross-fetch';

import { Href } from './href';
import { Action } from './models/action';
import { Serializer } from './serialize';
import { defaultSerializer } from './serialize/default-serializer';
import { NegativeValidationResult, ValidationError, Validator } from './validate';
import { noOpValidator } from './validate/no-op-validator';

export interface SubmitOptions {
  /**
   * Base URL used to resolve relative URIs
   */
  baseUrl?: Href;

  /**
   * Additional HTTP request options
   */
  requestInit?: RequestInit;

  /**
   * {@linkcode Serializer} used to serialize an {@link Action#fields `Action`'s `fields`}
   */
  serializer?: Serializer;

  /**
   * {@linkcode Validator} used to validate an {@link Action#fields `Action`'s `fields`}
   */
  validator?: Validator;
}

/**
 * Submits the given `action` by making an HTTP request according to `action`'s
 * `method` and `href`.
 *
 * If `fields` are present in `action`, they are validated via
 * `options.validator`. A {@linkcode ValidationError} is thrown when
 * `options.validator` returns a {@linkcode NegativeValidationResult}. If
 * `options.validator` is not provided, then validation automatically passes.
 *
 * If validation passes, the `fields` are then serialized according to
 * `options.serializer`, which receives `action`'s `type` and `fields`. If
 * `options.serializer` is not provided, the {@linkcode defaultSerializer} is
 * used. If `action.method` is `'GET'` or `'DELETE'`, the serialized content is
 * placed in the query string. Otherwise, the content is placed in the request
 * body.
 *
 * @example
 * import { defaultSerializer } from '@siren-js/client';
 *
 * await submit(action, {
 *   validator: (fields) => {
 *     // ensure each field has a non-nullish value
 *     if (fields.every((field) => field.value != null))
 *       return new PositiveValidationResult();
 *     else
 *       return new NegativeValidationResult();
 *   },
 *
 *   serializer: (type, fields) => {
 *     if (type === 'text/xml')
 *       return {
 *         content: // serialize fields to XML however you like...
 *       };
 *     else
 *       // rely on default serializer for any other type
 *       return defaultSerializer(type, field);
 *   }
 * })
 *
 * @param action an {@linkcode Action} to submit
 * @param options a {@linkcode SubmitOptions} object
 * @returns a `Promise` that fulfills with an HTTP `Response` object
 * @throws a {@linkcode ValidationError} when `options.validator` returns a {@linkcode NegativeValidationResult}
 */
export async function submit(action: Action, options: SubmitOptions = {}): Promise<Response> {
  const { method, href, fields } = action;
  const target = new URL(href, options.baseUrl);
  const init: RequestInit = {
    ...options.requestInit,
    method
  };

  if (fields.length > 0) {
    const validator = options.validator ?? noOpValidator;
    const result = validator(fields);
    if (result instanceof NegativeValidationResult) {
      throw new ValidationError(result);
    }

    const serializer = options.serializer ?? defaultSerializer;
    const serialization = await serializer(action.type, fields);

    if (init.method === 'GET' || init.method === 'DELETE') {
      target.search = serialization.content.toString();
    } else {
      if (serialization.contentType) {
        const headers = new Headers(init.headers);
        headers.set('Content-Type', serialization.contentType);
        init.headers = headers;
      }
      init.body = serialization.content;
    }
  }

  return fetch(target, init);
}
