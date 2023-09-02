/**
 * Transforms an array into an object to be used as the content of a request.
 */
export type SerializeFn<T, R extends BodyInit = BodyInit> = (t: T[]) => R;
