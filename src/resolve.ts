import { follow } from './follow';
import { EmbeddedLink, Entity, SubEntity } from './models';
import { parse } from './parse';

/**
 * Resolves a {@linkcode SubEntity} to an {@linkcode Entity}. An
 * `EmbeddedEntity` is returned as is, while an {@linkcode EmbeddedLink} is
 * {@linkcode follow | followed} and {@linkcode parse | parsed}.
 */
export async function resolve<T extends object = object>(subEntity: SubEntity): Promise<Entity<T>> {
  if (subEntity instanceof EmbeddedLink) {
    return follow(subEntity).then(parse) as Promise<Entity<T>>;
  }
  return Promise.resolve(subEntity as unknown as Entity<T>);
}
