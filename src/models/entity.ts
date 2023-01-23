import { Transform, Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

import { UnknownRecord } from '../utils/unknown-record';
import { Action } from './action';
import { Link } from './link';
import { SubEntity, transformSubEntities } from './sub-entity';

/**
 * Represents a URI-addressable resource
 * @typeParam T Type of the `properties` property
 */
export class Entity<T extends object = UnknownRecord> {
  /**
   * Available behavior exposed by the `Entity`
   */
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayUnique((action: Action) => action.name)
  @IsOptional()
  @Type(() => Action)
  actions: Action[] = [];

  /**
   * List of strings describing the nature of the `Entity` based on the current representation. Possible values are
   * implementation-dependent and should be documented.
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
   * Descriptive text about the `Entity`
   */
  @IsString()
  @IsOptional()
  title?: string;

  [extension: string]: unknown;
}
