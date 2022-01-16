import { Response } from 'cross-fetch';
import { Entity } from '@siren-js/core';
import ClientResponse from './response';
import siren from '../test/entity.json';

describe('SirenClientResponse', () => {
  const headers = [
    ['content-type', 'application/vnd.siren+json'],
    ['location', 'http://api.example.com/foo/bar/baz']
  ];
  const json = JSON.stringify(siren);
  let response: Response;
  let clientResponse: ClientResponse;

  beforeEach(() => {
    response = new Response(json, {
      status: 201,
      headers
    });
    clientResponse = new ClientResponse(response);
  });

  describe('siren()', () => {
    it('should resolve to Entity', async () => {
      const entity = await clientResponse.siren();

      expect(entity).toBeInstanceOf(Entity);
      expect(entity).toEqual(new Entity(siren));
    });

    it('should reject non-Siren', async () => {
      const response = new Response('foobar', {
        headers: { 'Content-Type': 'text/plain' }
      });
      const clientResponse = new ClientResponse(response);

      await expect(clientResponse.siren()).rejects.toThrow();
    });
  });

  it('should delegate properties', () => {
    expect(clientResponse.body).toBe(response.body);
    expect(clientResponse.bodyUsed).toBe(response.bodyUsed);
    expect(clientResponse.headers).toBe(response.headers);
    expect(clientResponse.ok).toBe(response.ok);
    expect(clientResponse.redirected).toBe(response.redirected);
    expect(clientResponse.status).toBe(response.status);
    expect(clientResponse.statusText).toBe(response.statusText);
    expect(clientResponse.trailer).toBe(response.trailer);
    expect(clientResponse.type).toBe(response.type);
    expect(clientResponse.url).toBe(response.url);
  });

  it('should delegate arrayBuffer()', async () => {
    const arrayBuffer = await clientResponse.arrayBuffer();

    expect(arrayBuffer.byteLength).toBe(json.length);
  });

  it('should delegate clone()', () => {
    expect(clientResponse.clone()).toEqual(clientResponse);
  });

  it('should delegate blob()', async () => {
    const blob = await clientResponse.blob();

    expect(blob.size).toBe(json.length);
    expect(blob.type).toBe('application/vnd.siren+json');
    await expect(blob.text()).resolves.toBe(json);
  });

  it('should delegate json()', async () => {
    await expect(clientResponse.json()).resolves.toEqual(siren);
  });

  it('should delegate text()', async () => {
    const text = 'foobar';
    clientResponse = new ClientResponse(new Response(text, { headers: { 'Content-Type': 'text/plain' } }));

    await expect(clientResponse.text()).resolves.toBe(text);
  });
});
