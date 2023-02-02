import { Field } from '../models/field';
import { fieldsToNameValuePairs } from './fields-to-name-value-pairs';
import { Serialization } from './serialization';
import { SerializeFn } from './serialize-fn';
import { serializeMultipartFormData } from './serialize-multipart-form-data';
import { serializePlainText } from './serialize-plain-text';
import { serializeUrlEncodedForm } from './serialize-url-encoded-form';
import { Serializer } from './serializer';
import { UnsupportedSerializerTypeError } from './unsupported-serializer-type-error';

const typeToSerializeFn = new Map<string, SerializeFn>([
  ['application/x-www-form-urlencoded', serializeUrlEncodedForm],
  ['multipart/form-data', serializeMultipartFormData],
  ['text/plain', serializePlainText]
]);

/**
 * Default {@linkcode Serializer} implementation with support for the following media `type`s:
 * - `application/x-www-form-url-encoded`
 * - `multipart/format-data`
 * - `text/plain`
 */
export const defaultSerializer: Serializer = (type: string, fields: Field[]): Promise<Serialization> =>
  new Promise((resolve, reject) => {
    const serialize = typeToSerializeFn.get(type);
    return serialize == null
      ? reject(new UnsupportedSerializerTypeError(type))
      : resolve({
          contentType: type,
          content: serialize(fieldsToNameValuePairs(fields))
        });
  });
