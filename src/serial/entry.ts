/**
 * Represents an [entry](https://xhr.spec.whatwg.org/#concept-formdata-entry) as
 * defined in WHATWG's XMLHttpRequest standard.
 */
export class Entry {
  /**
   * Implementation of a subset of the XMLHttpRequest standard's algorithm to
   * [create an entry](https://xhr.spec.whatwg.org/#create-an-entry). Namely,
   * `Blob` values and the optional `filename` parameter aren't currently
   * supported.
   */
  constructor(public readonly name: string, public readonly value: EntryValue) {}
}

export type EntryValue = File | string;
