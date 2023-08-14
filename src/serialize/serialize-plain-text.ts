import { isString } from 'class-validator';

import { NameValuePair } from '../types/name-value-pair';
import { SerializeFn } from '../types/serialize-fn';

/**
 * Transforms an array of {@linkcode NameValuePair} objects into a string by
 * joining each pair's name and value, separated by an `=` and ending in a CRLF.
 * If the value is a [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File)
 * object, its `name` is used.
 */
export const serializePlainText: SerializeFn<NameValuePair, string> = (nameValuePairs) =>
  nameValuePairs.reduce(
    (content, [name, value]) => `${content}${name}=${isString(value) ? value : value.name}\r\n`,
    ''
  );
