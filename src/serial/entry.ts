/**
 * Represents an [entry](https://xhr.spec.whatwg.org/#concept-formdata-entry) as
 * defined in WHATWG's XMLHttpRequest standard.
 */
export class Entry {
  #name: string;
  #value: EntryValue;

  /**
   * Implementation of a subset of the XMLHttpRequest standard's algorithm to
   * [create an entry](https://xhr.spec.whatwg.org/#create-an-entry). Namely,
   * `Blob` values and the optional `filename` parameter aren't currently
   * supported.
   */
  constructor(name: string, value: EntryValue) {
    this.#name = name;
    this.#value = value;
  }

  get name(): string {
    return this.#name;
  }

  get value(): EntryValue {
    return this.#value;
  }
}

export type EntryValue = File | string;
