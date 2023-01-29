import { Transform, Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

import { UnknownRecord } from '../utils/unknown-record';
import { Action } from './action';
import { Link } from './link';
import { SubEntity, transformSubEntities } from './sub-entity';

/**
 * Represents an embedded URI-addressable resource
 */
export class EmbeddedEntity<T extends UnknownRecord = UnknownRecord> {
  /**
   * Available behavior exposed by the `EmbeddedEntity`
   */
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayUnique((action: Action) => action.name)
  @IsOptional()
  @Type(() => Action)
  actions: Action[] = [];

  /**
   * List of strings describing the nature of the `EmbeddedEntity` based on the current representation. Possible values
   * are implementation-dependent and should be documented.
   */
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  class: string[] = [];

  /**
   * Related entities represented as embedded links or representations
   */
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Transform(({ value }) => transformSubEntities(value))
  entities: SubEntity[] = [];

  /**
   * Navigation links that communicate ways to navigate outside the entity graph
   */
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => Link)
  links: Link[] = [];

  /**
   * Key-value pairs describing the state of the `Entity`
   */
  @IsObject()
  @IsOptional()
  properties?: T;

  /**
   * List of strings describing the relationship of the `EmbeddedEntity` to its parent, per [RFC 8288](https://tools.ietf.org/html/rfc8288).
   */
  @IsArray()
  @IsString({ each: true })
  rel!: string[];

  /**
   * Descriptive text about the `Entity`
   */
  @IsString()
  @IsOptional()
  title?: string;

  [extensions: string]: unknown;

  /**
   * Returns the `Action` in `actions` with the given `name`, if it exists. Otherwise, returns `undefined`.
   */
  getAction(name: string): Action | undefined {
    return this.actions.find((action) => action.name === name);
  }
}
