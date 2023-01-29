import { IsArray, IsOptional, IsString } from 'class-validator';

/**
 * Represents an input control inside an `Action`. Serialization of a `Field` depends on its `type` and its
 * corresponding `Action`'s `type`.
 * @typeParam T Type of the `value` property.
 */
export class Field<T = unknown> {
  /**
   * List of strings describing the nature of the `Field` based on the current representation. Possible values are
   * implementation-dependent and should be documented.
   */
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  class: string[] = [];

  /**
   * Name describing the control. Must be unique within an `Action`.
   */
  @IsString()
  name!: string;

  /**
   * Textual annotation of a field. Clients may use this as a label.
   */
  @IsString()
  @IsOptional()
  title?: string;

  /**
   * Input type of the field. May include any of the [input types from HTML](https://html.spec.whatwg.org/multipage/input.html#attr-input-type).
   * When missing, the default is assumed to be `text`.
   */
  @IsString()
  @IsOptional()
  type = 'text';

  /**
   * Value assigned to the `Field`.
   */
  @IsOptional()
  value?: T;

  [extension: string]: unknown;
}
