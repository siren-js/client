/**
 * Result of serializing an {@link Action}
 */
export interface Serialization {
  content: BodyInit;

  /**
   * Media type of `content`. Omit this value to let the Fetch API generate the
   * `Content-Type` header.
   */
  contentType?: string;
}
