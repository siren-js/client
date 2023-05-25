import nock from 'nock';

import { entity, siren } from '../test/stubs';
import { EmbeddedEntity, EmbeddedLink } from './';
import { resolve } from './resolve';

describe('resolve', () => {
  beforeEach(() => {
    if (!nock.isActive()) {
      nock.activate();
    }
  });

  afterEach(() => {
    nock.restore();
  });

  it('should return EmbeddedEntity', async () => {
    const subEntity = new EmbeddedEntity();

    const result = await resolve(subEntity);

    expect(result).toBe(subEntity);
  });

  it('should follow and parse EmbeddedLink', async () => {
    const url = 'https://api.example.com/foo';
    const subEntity = new EmbeddedLink();
    subEntity.href = url;
    const scope = nock(url).get('').reply(200, siren);

    const result = await resolve(subEntity);

    expect(result).toStrictEqual(entity);
    expect(scope.isDone()).toBe(true);
  });
});
