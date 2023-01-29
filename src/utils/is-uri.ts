import { Matches, ValidationOptions } from 'class-validator';

/** `RegExp` for a URI as defined in [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986#appendix-B) */
const uriRegExp = /^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;

/**
 * Checks if string is a valid URI.
 *
 * Needed because `class-validator`'s `IsUrl` doesn't support `localhost`.
 */
export const IsUri = (options?: ValidationOptions) => Matches(uriRegExp, options);
