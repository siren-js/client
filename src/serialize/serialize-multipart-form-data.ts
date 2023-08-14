import { NameValuePair } from '../types/name-value-pair';
import { SerializeFn } from '../types/serialize-fn';

/**
 * Transforms an array of {@linkcode NameValuePair} objects into a
 * [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
 * object.
 */
export const serializeMultipartFormData: SerializeFn<NameValuePair, FormData> = (nameValuePairs) =>
  nameValuePairs.reduce((formData, [name, value]) => {
    formData.append(name, value);
    return formData;
  }, new FormData());
