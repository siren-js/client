import { Action, EmbeddedLink, Entity, Link } from '@siren-js/core';
import { Headers } from 'cross-fetch';
import nock from 'nock';
import Client from '../client';
import { Serializers } from '../serializer';
import siren from './entity.json';

const baseUrl = 'http://api.example.com';
const entity = new Entity(siren);
const json = JSON.stringify(entity);
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

describe('Client', () => {
  let client: Client;
  let scope: nock.Scope;

  beforeEach(() => {
    client = new Client();
  });

  describe('headers', () => {
    it('should have defaults', () => {
      const headers = [...client.headers.entries()];
      expect(headers).toEqual([['accept', Client.DEFAULT_ACCEPT_PREFERENCE]]);
    });

    describe('init', () => {
      it('should accept record', () => {
        client = new Client({ headers: { Foo: 'bar', Baz: 'qux' } });

        expect(client.headers.get('Foo')).toBe('bar');
        expect(client.headers.get('Baz')).toBe('qux');
      });

      it('should accept pairs', () => {
        client = new Client({
          headers: [
            ['Foo', 'bar'],
            ['Baz', 'qux']
          ]
        });

        expect(client.headers.get('Foo')).toBe('bar');
        expect(client.headers.get('Baz')).toBe('qux');
      });

      it('should accept Headers', () => {
        client = new Client({
          headers: new Headers({ Foo: 'bar', Baz: 'qux' })
        });

        expect(client.headers.get('Foo')).toBe('bar');
        expect(client.headers.get('Baz')).toBe('qux');
      });

      it('should ignore unsupported type', () => {
        client = new Client({
          headers: 'foobar' as any
        });

        expect([...client.headers.entries()]).toHaveLength(1);
      });

      it('should overwrite defaults', () => {
        const preference = 'application/xml';
        client = new Client({
          headers: { Accept: preference }
        });

        expect(client.headers.get('Accept')).toBe(preference);
      });
    });
  });

  describe('serializers', () => {
    it('should have defaults', () => {
      expect([...client.serializers.keys()]).toEqual([
        'application/x-www-form-urlencoded',
        // 'multipart/form-data',
        'text/plain'
      ]);
    });

    describe('initialization', () => {
      const serializer = () => '';

      it('should accept record', () => {
        client = new Client({
          serializers: {
            'application/json': serializer,
            'application/xml': serializer
          }
        });

        expect(client.serializers.get('application/json')).toBe(serializer);
        expect(client.serializers.get('application/xml')).toBe(serializer);
      });

      it('should accept pairs', () => {
        client = new Client({
          serializers: [
            ['application/json', serializer],
            ['application/xml', serializer]
          ]
        });

        expect(client.serializers.get('application/json')).toBe(serializer);
        expect(client.serializers.get('application/xml')).toBe(serializer);
      });

      it('should accept Serializers', () => {
        client = new Client({
          serializers: new Serializers({
            'application/json': serializer,
            'application/xml': serializer
          })
        });

        expect(client.serializers.get('application/json')).toBe(serializer);
        expect(client.serializers.get('application/xml')).toBe(serializer);
      });

      it('should ignore unsupported type', () => {
        client = new Client({
          serializers: 'foobar' as any
        });

        expect(client.serializers.size).toBe(2);
      });

      it('should overwrite defaults', () => {
        const mediaType = 'application/x-www-form-urlencoded';
        client = new Client({
          serializers: { [mediaType]: serializer }
        });

        expect(client.serializers.get(mediaType)).toBe(serializer);
      });
    });
  });

  describe('fetch()', () => {
    afterEach(() => {
      expect(scope.isDone()).toBe(true);
    });

    it('should return successful Siren response', async () => {
      scope = nock(baseUrl).get('/').reply(200, json, replyHeaders);

      const response = await client.fetch(baseUrl);

      expect(response.ok).toBe(true);
      expect(response.headers.get('Content-Type')).toBe(sirenMediaType);
      await expect(response.siren()).resolves.toEqual(entity);
    });

    it('should return unsuccessful Siren response', async () => {
      scope = nock(baseUrl).get('/').reply(404, json, replyHeaders);

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

    it('should include headers in request', async () => {
      client.headers.set('Foo', 'bar');
      scope = nock(baseUrl, { reqheaders: { Foo: 'bar' } })
        .get('/')
        .reply(204);

      await client.fetch(baseUrl);
    });

    it('should add headers to RequestInit', async () => {
      client.headers.set('Foo', 'bar');
      scope = nock(baseUrl, { reqheaders: { Foo: 'bar' } })
        .post('/')
        .reply(204);

      await client.fetch(baseUrl, { method: 'POST' });
    });

    it('should overwrite headers from RequestInit', async () => {
      client.headers.set('Foo', 'bar');
      scope = nock(baseUrl, { reqheaders: { Foo: 'baz' } })
        .get('/')
        .reply(204);

      await client.fetch(baseUrl, { headers: { Foo: 'baz' } });
    });
  });

  describe('follow()', () => {
    afterEach(() => {
      expect(scope.isDone()).toBe(true);
    });

    it('should follow a Link', async () => {
      scope = nock(baseUrl).get('/about').reply(200, json, replyHeaders);
      const link = new Link(['about'], `${baseUrl}/about`);

      const response = await client.follow(link);

      expect(response.ok).toBe(true);
      await expect(response.siren()).resolves.toEqual(entity);
    });

    it('should follow an EmbeddedLink', async () => {
      scope = nock(baseUrl).get('/42').reply(200, json, replyHeaders);
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
      scope = nock(baseUrl).get('/author').reply(200, json, replyHeaders);

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
    afterEach(() => {
      expect(scope.isDone()).toBe(true);
    });

    it('should submit action without method as GET', async () => {
      const action = new Action('search', `${baseUrl}/search`);
      scope = nock(baseUrl).get('/search').reply(204);

      const response = await client.submit(action);

      expect(response.ok).toBe(true);
    });

    describe('default application/x-www-form-urlencoded serializer', () => {
      const urlEncodedForm = 'query=lorem+ipsum&page=42';
      const path = '/foos';
      const uri = `${path}?${urlEncodedForm}`;
      let action: Action;

      beforeEach(() => {
        action = new Action('foo', `${baseUrl}/foos`, {
          fields: [
            { name: 'query', value: 'lorem ipsum' },
            { name: 'page', value: 42 }
          ]
        });
      });

      it('should use as the default type', async () => {
        scope = nock(baseUrl).get(uri).reply(204);

        const response = await client.submit(action);

        expect(response.ok).toBe(true);
      });

      it('should be enforced for methods with undefined payload semantics', async () => {
        scope = nock(baseUrl).get(uri).reply(204);
        action.type = 'application/json';

        const response = await client.submit(action);

        expect(response.ok).toBe(true);
      });

      it('should serialize fields in payload for methods that support one', async () => {
        const reqheaders = requestHeaderMatcher(
          'application/x-www-form-urlencoded'
        );
        scope = nock(baseUrl, { reqheaders })
          .post(path, urlEncodedForm)
          .reply(204);
        action.method = 'POST';

        const response = await client.submit(action);

        expect(response.ok).toBe(true);
      });
    });

    // describe('default multipart/form-data serializer', () => {
    //   const type = 'multipart/form-data';
    //   const action = new Action('foo', `${baseUrl}/foos`, {
    //     type,
    //     method: 'POST',
    //     fields: [
    //       { name: 'query', value: 'lorem ipsum' },
    //       { name: 'page', value: 42 }
    //     ]
    //   });
    // });

    describe('default text/plain serializer', () => {
      const type = 'text/plain';
      const action = new Action('foo', `${baseUrl}/foos`, {
        type,
        method: 'POST',
        fields: [
          { name: 'query', value: 'lorem ipsum' },
          { name: 'page', value: 42 }
        ]
      });
      const body = 'query=lorem ipsum\r\npage=42\r\n';

      it('should serialize fields in payload', async () => {
        const reqheaders = requestHeaderMatcher(type);
        const status = 204;
        scope = nock(baseUrl, { reqheaders }).post('/foos', body).reply(status);

        const response = await client.submit(action);

        expect(response.status).toBe(status);
      });
    });

    describe('custom serializers', () => {
      let action: Action;
      const type = 'application/json';
      const body = JSON.stringify({
        query: 'lorem ipsum',
        page: 42
      });

      beforeEach(() => {
        action = new Action('foo', baseUrl, {
          type,
          method: 'POST',
          fields: [
            { name: 'query', value: 'lorem ipsum' },
            { name: 'page', value: 42 }
          ]
        });
      });

      it('should use when present', async () => {
        client.serializers.set(type, () => ({
          contentType: type,
          body
        }));
        const reqheaders = requestHeaderMatcher(type);
        scope = nock(baseUrl, { reqheaders }).post('/', body).reply(204);

        const response = await client.submit(action);

        expect(response.ok).toBe(true);
      });

      it('should default Content-Type to plain text', async () => {
        client.serializers.set(type, () => ({ body }));
        const reqheaders = requestHeaderMatcher('text/plain');
        scope = nock(baseUrl, { reqheaders }).post('/', body).reply(204);

        const response = await client.submit(action);

        expect(response.ok).toBe(true);
      });

      it('should error when no serializer present for type', async () => {
        await expect(client.submit(action)).rejects.toThrow();

        action.method = 'GET';
        action.type = 'application/x-www-form-urlencoded';
        client.serializers.delete(action.type);

        await expect(client.submit(action)).rejects.toThrow();
      });

      it('should not error when no fields present', async () => {
        action.fields = undefined;
        scope = nock(baseUrl).post('/').reply(204);

        const response = await client.submit(action);

        expect(response.ok).toBe(true);
      });
    });
  });
});

function requestHeaderMatcher(
  mediaType: string
): Record<string, nock.RequestHeaderMatcher> {
  return {
    'Content-Type': RegExp(`^${mediaType}`)
  };
}
