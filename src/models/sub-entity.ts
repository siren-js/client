import { ClassConstructor, plainToInstance, TypeHelpOptions } from 'class-transformer';
import { isArray } from 'class-validator';

import { EmbeddedEntity } from './embedded-entity';
import { EmbeddedLink } from './embedded-link';

export type SubEntity = EmbeddedEntity | EmbeddedLink;

type SubEntityConstructor = ClassConstructor<SubEntity>;

export const subEntityTypeFunction = (value: TypeHelpOptions) =>
  'href' in value?.newObject ? EmbeddedLink : EmbeddedEntity;

export function transformSubEntities(subEntities: unknown): SubEntity[] | unknown {
  if (!isArray(subEntities)) return subEntities;
  return subEntities.map((subEntity) => {
    const constructor: SubEntityConstructor = subEntity.href ? EmbeddedLink : EmbeddedEntity;
    return plainToInstance(constructor, subEntity);
  });
}
