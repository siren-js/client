import { isRecord } from '../utils/is-record';

export interface Serialization {
  mediaType: string;
  body: BodyInit;
}

export function isSerialization(value: unknown): value is Serialization {
  return (
    isRecord(value) &&
    (typeof value.contentType === 'string' || value.contentType == null) &&
    (typeof value.body === 'object' || typeof value.body === 'string')
  );
}

export default Serialization;
