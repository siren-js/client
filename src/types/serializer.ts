import { Field } from '../models/field';
import { Serialization } from './serialization';

/**
 * Serializes an array of {@linkcode Field} objects to the given media `type`.
 * @param type media type of the target serialization
 * @param fields array of {@linkcode Field} objects
 * @returns `Promise` that resolves to a {@linkcode Serialization}
 * @throws {@linkcode UnsupportedSerializerTypeError} when `type` is not supported
 */
export type Serializer = (type: string, fields: Field[]) => Promise<Serialization>;
