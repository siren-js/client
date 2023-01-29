/**
 * Indicates a `Serializer` does not support the given `type`
 */
export class UnsupportedSerializerTypeError extends Error {
  constructor(public readonly type: string) {
    super(`Unable to serialize type '${type}'`);
  }
}
