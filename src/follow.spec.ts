import nock from 'nock';

import { follow } from './follow';

describe('follow', () => {
  const url = new URL('https://api.example.com/foo');
  const responseBody = 'Success!';

  beforeEach(() => {
    if (!nock.isActive()) {
      nock.activate();
    }
  });

  afterEach(() => {
    nock.restore();
  });

  it.each([
    ['string', url.toString()],
    ['URL', url],
    ['Hyperlink', { href: url.toString() }]
  ])('should make GET request for a %s', async (_, target) => {
    const scope = nock(url.toString()).get('').reply(200, responseBody);

    const response = await follow(target);

    expect(response.url).toBe(url.toString());
    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toBe(responseBody);
    expect(scope.isDone()).toBe(true);
  });

  it('should accept and send request options', async () => {
    const apiKey = 'foo-bar-baz';
    const headers = { 'Api-Key': apiKey };
    const scope = nock(url.toString(), { reqheaders: headers }).get('').reply(200, responseBody);

    const response = await follow(url, { requestInit: { headers } });

    expect(response.url).toBe(url.toString());
    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toBe(responseBody);
    expect(scope.isDone()).toBe(true);
  });

  it('should resolve relative URL', async () => {
    const url = new URL('http://foo.example.com/foo');
    const scope = nock(url.toString()).get('').reply(200, responseBody);

    const response = await follow({ href: '/foo' }, { baseUrl: url.origin });

    expect(response.url).toBe(url.toString());
    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toBe(responseBody);
    expect(scope.isDone()).toBe(true);
  });
});
