import { isMimeType } from 'class-validator';

import { merge } from '../merge';
import { toEntryList } from './entry-list';
import { toMultipartFormData } from './multipart-form-data';
import { toNameValuePairs } from './name-value-pairs';
import { Serializer } from './serializer';

export class Serializers extends Map<string, Serializer> {
  static get MULTIPART_FORM_DATA(): Serializer {
    return (action) => {
      const entryList = toEntryList(action);
      return toMultipartFormData(entryList);
    };
  }

  static get PLAIN_TEXT_FORM_DATA(): Serializer {
    return (action) => {
      const entryList = toEntryList(action);
      return toNameValuePairs(entryList).reduce((result, [name, value]) => `${result}${name}=${value}\r\n`, '');
    };
  }

  static get URL_ENCODED_FORM_DATA(): Serializer {
    return (action) => {
      const entryList = toEntryList(action);
      const nameValuePairs = toNameValuePairs(entryList);
      return new URLSearchParams(nameValuePairs);
    };
  }

  constructor(init?: SerializersInit) {
    super();
    if (init != null) {
      this.merge(init);
    }
  }

  /* istanbul ignore next: customizing parameter name */
  delete(mediaType: string): boolean {
    return super.delete(mediaType);
  }

  /* istanbul ignore next: customizing parameter name */
  get(mediaType: string): Serializer | undefined {
    return super.get(mediaType);
  }

  /* istanbul ignore next: customizing parameter name */
  has(mediaType: string): boolean {
    return super.has(mediaType);
  }

  set(mediaType: string, serializer: Serializer): this {
    if (!isMimeType(mediaType)) {
      throw new Error(`Invalid media type: '${mediaType}'`);
    }
    if (typeof serializer !== 'function') {
      throw new Error('Serializer must be a function');
    }
    return super.set(mediaType, serializer);
  }

  merge(that: SerializersInit): void {
    merge(this, that, (source): source is Serializers => source instanceof Serializers || source instanceof Map);
  }
}

export type SerializersInit = [string, Serializer][] | Record<string, Serializer> | Serializers;
