import '../test/setup';

import nock from 'nock';

import { entity, siren } from '../test/stubs';
import { follow } from './follow';
import { Entity } from './models/entity';
import { parse } from './parse';

describe('parse', () => {
  it('should parse JSON text as Entity', async () => {
    const result = await parse(siren);

    expect(result).toBeInstanceOf(Entity);
    expect(result).toEqual(entity);
  });

  it('should parse object as Entity', async () => {
    const result = await parse(entity);

    expect(result).toBeInstanceOf(Entity);
    expect(result).toEqual(entity);
  });

  it('should parse Response body as Entity', async () => {
    nock('https://api.example.com').get('/people/69420').reply(200, entity);
    const response = await follow('https://api.example.com/people/69420');

    const result = await parse(response);

    expect(result).toBeInstanceOf(Entity);
    expect(result).toEqual(entity);
  });

  it('should throw error when JSON text is invalid Siren', async () => {
    await expect(parse('"foo"')).rejects.toThrow();
  });

  it('should throw error when Response body is not Siren', async () => {
    nock('https://api.example.com').get('/people/69420').reply(200, 'foo');
    const response = await follow('https://api.example.com/people/69420');

    await expect(parse(response)).rejects.toThrow();
  });
});
