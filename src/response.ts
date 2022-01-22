import { Entity } from '@siren-js/core';

/**
 * [Decorates](https://en.wikipedia.org/wiki/Decorator_pattern) a
 * [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)
 * object with the `siren()` method for parsing JSON
 * [Siren](https://github.com/kevinswiber/siren) (`application/vnd.siren+json`).
 */
export default class ClientResponse implements Response {
  #response;

  constructor(response: Response) {
    this.#response = response;
  }

  /**
   * Takes a `Response` stream and reads it to completion. It returns a
   * promise that resolves with the result of parsing the body text as a Siren
   * `Entity`.
   */
  async siren(): Promise<Entity> {
    const body = await this.#response.json();
    return new Entity(body);
  }

  /////////////////////////////////////////
  // delegated Response and Body members //
  /////////////////////////////////////////

  get headers() {
    return this.#response.headers;
  }

  get ok() {
    return this.#response.ok;
  }

  get redirected() {
    return this.#response.redirected;
  }

  get status() {
    return this.#response.status;
  }

  get statusText() {
    return this.#response.statusText;
  }

  get type() {
    return this.#response.type;
  }

  get url() {
    return this.#response.url;
  }

  get body() {
    return this.#response.body;
  }

  get bodyUsed() {
    return this.#response.bodyUsed;
  }

  clone() {
    return new ClientResponse(this.#response.clone());
  }

  arrayBuffer() {
    return this.#response.arrayBuffer();
  }

  blob() {
    return this.#response.blob();
  }

  formData() {
    /* istanbul ignore next: formData method is undefined in the implementation */
    return this.#response.formData();
  }

  json() {
    return this.#response.json();
  }

  text() {
    return this.#response.text();
  }
}
