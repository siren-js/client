import { Field } from '../models';
import { SerializeFn } from './serialize-fn';

/**
 * Builds and stringifies a JSON object from the given `fields`' `name` and
 * `value`. If the `value` is a [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File),
 * its `name` is used.
 */
export const serializeJson: SerializeFn<Field, string> = (fields) => {
  const entries = fields.map((field) => {
    const value = field.value instanceof File ? field.value.name : field.value;
    return [field.name, value];
  });
  const obj = Object.fromEntries(entries);
  return JSON.stringify(obj);
};
