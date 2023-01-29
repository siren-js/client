import { isString } from 'class-validator';

import { NameValuePair } from './name-value-pair';
import { SerializeFn } from './serialize-fn';

/**
 * Transforms an array of {@linkcode NameValuePair} objects into a
 * [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
 * object. If the value is a [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File)
 * object, its `name` is used.
 */
export const serializeUrlEncodedForm: SerializeFn = (nameValuePairs: NameValuePair[]): URLSearchParams =>
  nameValuePairs.reduce((params, [name, value]) => {
    params.append(name, isString(value) ? value : value.name);
    return params;
  }, new URLSearchParams());
