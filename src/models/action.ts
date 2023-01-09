import { Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsMimeType, IsOptional, IsString, ValidateNested } from 'class-validator';

import { IsUri } from '../utils/is-uri';
import { Field } from './field';

/**
 * Represents available behavior exposed by an `Entity`.
 */
export class Action {
  /**
   * List of strings describing the nature of the `Action` based on the current representation. Possible values are
   * implementation-dependent and should be documented.
   */
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  class?: string[];

  /**
   * Input controls of the `Action`.
   */
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayUnique((field: Field) => field.name)
  @IsOptional()
  @Type(() => Field)
  fields?: Field[];

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
  method?: string = 'GET';

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
  type?: string = 'application/x-www-form-urlencoded';

  [extensions: string]: unknown;
}
