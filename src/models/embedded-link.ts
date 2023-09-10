import { ArrayMinSize, IsArray, IsMimeType, IsOptional, IsString } from 'class-validator';

import { IsUri } from '../utils/is-uri';
import { SirenElementVisitor } from '../visitor';
import { SirenElement } from './siren-element';

/**
 * Represent a sub-entity as a link
 */
export class EmbeddedLink implements SirenElement {
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
  @ArrayMinSize(1)
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

  [extensions: string]: unknown;

  /**
   * Visits this embedded link.
   */
  async accept(visitor: SirenElementVisitor): Promise<void> {
    await visitor.visitEmbeddedLink(this);
  }
}
