import { NameValuePair } from './name-value-pair';

/**
 * Transforms an array of {@linkcode NameValuePairs} into an object to be used as the content of a request.
 */
export type SerializeFn = (nameValuePairs: NameValuePair[]) => BodyInit;
