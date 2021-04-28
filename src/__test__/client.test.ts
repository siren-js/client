import { Action, EmbeddedLink, Entity, Link } from '@siren-js/core';
import nock from 'nock';
import Client from '../client';

const baseUrl = 'http://api.example.com';

const entity = new Entity({
  class: ['foo'],
  entities: [
    {
      rel: ['link'],
      href: `${baseUrl}/foo/bar`
    },
    {
      class: ['entity'],
      rel: ['entity'],
      links: [{ rel: ['self'], href: `${baseUrl}/foo/bar/baz` }]
    },
    {
      class: ['missing-link'],
      rel: ['missing-link']
    }
  ],
  actions: [
    {
      name: 'search',
      href: `${baseUrl}/foo`,
      fields: [
        { name: 'foo', value: 'bar' },
        { name: 'bar', type: 'number', value: 42 },
        { name: 'baz', value: 'foo bar/baz' }
      ]
    },
    {
      name: 'create',
      method: 'POST',
      href: `${baseUrl}/foo`,
      fields: [
        { name: 'foo', value: 'bar' },
        { name: 'bar', type: 'number', value: 42 },
        { name: 'baz', value: 'foo bar/baz' }
      ]
    }
  ],
  links: [{ rel: ['self'], href: `${baseUrl}/foo` }]
});

const siren = JSON.stringify(entity);

const sirenMediaType = 'application/vnd.siren+json';

const replyHeaders = {
  'Content-Type': sirenMediaType
};

beforeEach(() => {
  if (!nock.isActive()) {
    nock.activate();
  }
});

afterEach(() => {
  nock.restore();
});

describe('SirenClient', () => {
  let client: Client;
  let scope: nock.Scope;

  beforeEach(() => {
    client = new Client();
  });

  afterEach(() => {
    expect(scope.isDone()).toBe(true);
  });

  describe('fetch()', () => {
    it('should return successful Siren response', async () => {
      scope = nock(baseUrl).get('/').reply(200, siren, replyHeaders);

      const response = await client.fetch(baseUrl);

      expect(response.ok).toBe(true);
      expect(response.headers.get('Content-Type')).toBe(sirenMediaType);
      await expect(response.siren()).resolves.toEqual(entity);
    });

    it('should return unsuccessful Siren response', async () => {
      scope = nock(baseUrl).get('/').reply(404, siren, replyHeaders);

      const response = await client.fetch(baseUrl);

      expect(response.headers.get('Content-Type')).toBe(sirenMediaType);
      await expect(response.siren()).resolves.toEqual(entity);
    });

    it('should return successful non-Siren response', async () => {
      const body = 'foobar';
      const mediaType = 'text/plain';
      scope = nock(baseUrl).get('/').reply(200, body, {
        'Content-Type': mediaType
      });

      const response = await client.fetch(baseUrl);

      expect(response.ok).toBe(true);
      expect(response.headers.get('Content-Type')).toBe(mediaType);
      await expect(response.text()).resolves.toBe(body);
    });

    it('should return unsuccessful non-Siren response', async () => {
      const body = 'foobar';
      const mediaType = 'text/plain';
      scope = nock(baseUrl).get('/').reply(404, body, {
        'Content-Type': mediaType
      });

      const response = await client.fetch(baseUrl);

      expect(response.headers.get('Content-Type')).toBe(mediaType);
      await expect(response.text()).resolves.toBe(body);
    });
  });

  describe('follow()', () => {
    it('should follow a Link', async () => {
      scope = nock(baseUrl).get('/about').reply(200, siren, replyHeaders);
      const link = new Link(['about'], `${baseUrl}/about`);

      const response = await client.follow(link);

      expect(response.ok).toBe(true);
      await expect(response.siren()).resolves.toEqual(entity);
    });

    it('should follow an EmbeddedLink', async () => {
      scope = nock(baseUrl).get('/42').reply(200, siren, replyHeaders);
      const link = new EmbeddedLink(['item'], `${baseUrl}/42`);

      const response = await client.follow(link);

      expect(response.ok).toBe(true);
      await expect(response.siren()).resolves.toEqual(entity);
    });

    it('should follow link to non-Siren resource', async () => {
      const body = 'foobar';
      const mediaType = 'text/plain';
      scope = nock(baseUrl).get('/foos').reply(200, body, {
        'Content-Type': mediaType
      });
      const link = new Link(['collection'], `${baseUrl}/foos`);

      const response = await client.follow(link);

      expect(response.headers.get('Content-Type')).toBe(mediaType);
      await expect(response.text()).resolves.toBe(body);
    });

    it('should accept link-like object', async () => {
      scope = nock(baseUrl).get('/author').reply(200, siren, replyHeaders);

      const response = await client.follow({ href: `${baseUrl}/author` });

      expect(response.ok).toBe(true);
      await expect(response.siren()).resolves.toEqual(entity);
    });

    it('should reject when given object without href', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const values: any[] = [undefined, null, true, 42, 'foo', [1, 2, 3], {}];
      for (const value of values) {
        await expect(client.follow(value)).rejects.toBe(
          'cannot follow a link without an href'
        );
      }
    });
  });

  describe('submit()', () => {
    it('should submit action without method as GET', async () => {
      const action = new Action('search', `${baseUrl}/search`);
      scope = nock(baseUrl).get('/search').reply(204);

      const response = await client.submit(action);

      expect(response.ok).toBe(true);
    });

    it('should submit fields as query string when method is GET or DELETE', async () => {
      const path = '/foos?query=lorem+ipsum&page=42';
      scope = nock(baseUrl).get(path).reply(204).delete(path).reply(204);
      const action = new Action('foo', `${baseUrl}/foos`, {
        fields: [
          { name: 'query', value: 'lorem ipsum' },
          { name: 'page', value: 42 }
        ]
      });

      const methods = ['GET', 'DELETE'];
      for (const method of methods) {
        action.method = method;

        const response = await client.submit(action);

        expect(response.ok).toBe(true);
      }
    });

    it('should submit fields as body for other methods', async () => {
      const path = '/foos';
      const body = 'title=lorem+ipsum&price=42';
      scope = nock(baseUrl, {
        reqheaders: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
        .post(path, body)
        .reply(204)
        .put(path, body)
        .reply(204)
        .patch(path, body)
        .reply(204);
      const action = new Action('foo', `${baseUrl}/foos`, {
        fields: [
          { name: 'title', value: 'lorem ipsum' },
          { name: 'price', value: 42 }
        ]
      });

      const methods = ['POST', 'PUT', 'PATCH'];
      for (const method of methods) {
        action.method = method;

        const response = await client.submit(action);

        expect(response.ok).toBe(true);
      }
    });
  });
});
