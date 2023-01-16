import { transformAndValidate } from 'class-transformer-validator';
import { isString } from 'class-validator';
import { Response } from 'cross-fetch';

import { Entity } from './models/entity';
import { UnknownRecord } from './utils/unknown-record';

export type Parsable = string | UnknownRecord | Response;

/**
 * Parses `value` as an {@link Entity}
 * @typeParam T - type of `Entity.properties`
 */
export async function parse<T extends object = UnknownRecord>(value: Parsable): Promise<Entity<T>> {
  let obj: object;
  if (value instanceof Response) {
    obj = await value.json();
  } else if (isString(value)) {
    obj = JSON.parse(value);
  } else {
    obj = value;
  }
  const entity = await transformAndValidate(Entity, obj);
  return entity as Entity<T>;
}
