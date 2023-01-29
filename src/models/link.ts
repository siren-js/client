import { IsArray, IsMimeType, IsOptional, IsString } from 'class-validator';

import { IsUri } from '../utils/is-uri';

/**
 * Represents a URI-addressable resource
 */
export class Link {
  /**
   * List of strings describing the nature of the `Link` based on the current representation. Possible values are
   * implementation-dependent and should be documented.
   */
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  class: string[] = [];

  /**
   * URI of the linked resource.
   */
  @IsUri()
  href!: string;

  /**
   * List of strings describing the relationship of the `Link` to its `Entity`, per [RFC 8288](https://tools.ietf.org/html/rfc8288).
   */
  @IsArray()
  @IsString({ each: true })
  rel!: string[];

  /**
   * Text describing the nature of the link.
   */
  @IsString()
  @IsOptional()
  title?: string;

  /**
   * Hint indicating what the media type of the result of dereferencing the `Link` should be, per [RFC 8288](https://tools.ietf.org/html/rfc8288#section-3.4.1).
   */
  @IsMimeType()
  @IsOptional()
  type?: string;

  [extension: string]: unknown;
}
