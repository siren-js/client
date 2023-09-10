import { Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsMimeType, IsOptional, IsString, ValidateNested } from 'class-validator';

import { IsUri } from '../utils/is-uri';
import { SirenElementVisitor } from '../visitor';
import { Field } from './field';
import { SirenElement } from './siren-element';

/**
 * Represents available behavior exposed by an `Entity`.
 */
export class Action implements SirenElement {
  /**
   * List of strings describing the nature of the `Action` based on the current representation. Possible values are
   * implementation-dependent and should be documented.
   */
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  class: string[] = [];

  /**
   * Input controls of the `Action`.
   */
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayUnique((field: Field) => field.name)
  @IsOptional()
  @Type(() => Field)
  fields: Field[] = [];

  /**
   * URI of the action
   */
  @IsUri()
  href!: string;

  /**
   * Protocol method used when submitting the `Action`. When missing, the default is assumed to be `'GET'`.
   */
  @IsString()
  @IsOptional()
  method = 'GET';

  /**
   * Name identifying the action to be performed. Must be unique within an `Entity`'s `actions`.
   */
  @IsString()
  name!: string;

  /**
   * Descriptive text about the `Action`.
   */
  @IsString()
  @IsOptional()
  title?: string;

  /**
   * Encoding type indicating how `fields` are serialized when submitting the `Action`. When missing, the default is
   * assumed to be `'application/x-www-form-urlencoded'`.
   */
  @IsMimeType()
  @IsOptional()
  type = 'application/x-www-form-urlencoded';

  [extensions: string]: unknown;

  /**
   * Visits this action's {@linkcode fields} followed by the action itself.
   */
  async accept(visitor: SirenElementVisitor): Promise<void> {
    await Promise.all(this.fields.map((field) => field.accept(visitor)));
    await visitor.visitAction(this);
  }

  /**
   * Returns the `Field` in `fields` with the given `name`, if it exists. Otherwise, returns `undefined`.
   */
  getField(name: string): Field | undefined {
    return this.fields.find((field) => field.name === name);
  }
}
