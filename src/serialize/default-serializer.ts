import { Field } from '../models/field';
import { fieldsToNameValuePairs } from './fields-to-name-value-pairs';
import { NameValuePair } from './name-value-pair';
import { Serialization } from './serialization';
import { SerializeFn } from './serialize-fn';
import { serializeJson } from './serialize-json';
import { serializeMultipartFormData } from './serialize-multipart-form-data';
import { serializePlainText } from './serialize-plain-text';
import { serializeUrlEncodedForm } from './serialize-url-encoded-form';
import { Serializer } from './serializer';
import { UnsupportedSerializerTypeError } from './unsupported-serializer-type-error';

const withNameValuePairs = (fn: SerializeFn<NameValuePair>) => (fields: Field[]) => fn(fieldsToNameValuePairs(fields));

const typeToSerializeFn = new Map<string, SerializeFn<Field>>([
  ['application/json', serializeJson],
  ['application/x-www-form-urlencoded', withNameValuePairs(serializeUrlEncodedForm)],
  ['multipart/form-data', withNameValuePairs(serializeMultipartFormData)],
  ['text/plain', withNameValuePairs(serializePlainText)]
]);

/**
 * Default {@linkcode Serializer} implementation with support for the following media `type`s:
 * - `application/json`
 * - `application/x-www-form-url-encoded`
 * - `multipart/format-data`
 * - `text/plain`
 */
export const defaultSerializer: Serializer = (type, fields): Promise<Serialization> =>
  new Promise((resolve, reject) => {
    const serialize = typeToSerializeFn.get(type);
    if (serialize == null) return reject(new UnsupportedSerializerTypeError(type));

    const content = serialize(fields);

    return resolve({
      content,
      // let the Fetch API generate a boundary parameter for FormData
      contentType: content instanceof FormData ? undefined : type
    });
  });
