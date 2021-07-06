import { Action } from '@siren-js/core';
import {
  isMediaTypeString,
  isRecord
} from '@siren-js/core/dist/util/type-guard';
import { merge } from './merge';

export type Serializer = (
  action: Action
) => BodyInit | Serialization | Promise<BodyInit | Serialization>;

export interface Serialization {
  contentType?: string;
  body: BodyInit;
}

export function isSerialization(value: unknown): value is Serialization {
  return (
    isRecord(value) &&
    (typeof value.contentType === 'string' || value.contentType == null) &&
    (typeof value.body === 'object' || typeof value.body === 'string')
  );
}

export class Serializers extends Map<string, Serializer> {
  constructor(init?: SerializersInit) {
    super();
    if (init != null) {
      this.merge(init);
    }
  }

  /* istanbul ignore next */
  /* customizing parameter name */
  delete(mediaType: string): boolean {
    return super.delete(mediaType);
  }

  /* istanbul ignore next */
  /* customizing parameter name */
  get(mediaType: string): Serializer | undefined {
    return super.get(mediaType);
  }

  /* istanbul ignore next */
  /* customizing parameter name */
  has(mediaType: string): boolean {
    return super.has(mediaType);
  }

  set(mediaType: string, serializer: Serializer): this {
    if (!isMediaTypeString(mediaType)) {
      throw new Error(`Invalid media type: '${mediaType}'`);
    }
    if (typeof serializer !== 'function') {
      throw new Error('Serializer must be a function');
    }
    return super.set(mediaType, serializer);
  }

  merge(that: SerializersInit): void {
    merge(
      this,
      that,
      (source): source is Serializers =>
        source instanceof Serializers || source instanceof Map
    );
  }
}

export type SerializersInit =
  | [string, Serializer][]
  | Record<string, Serializer>
  | Serializers;
