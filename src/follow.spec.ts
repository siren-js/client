import nock from 'nock';

import { follow } from './follow';

describe('follow', () => {
  const url = new URL('https://api.example.com/foo');
  const urlString = url.toString();
  const responseBody = 'Success!';
  let scope: nock.Scope;

  function setupNockScope(reqheaders?: Record<string, nock.RequestHeaderMatcher>) {
    scope = nock(urlString, { reqheaders }).get('').reply(200, responseBody);
  }

  beforeEach(() => {
    if (!nock.isActive()) {
      nock.activate();
    }
  });

  afterEach(() => {
    expect(scope.isDone()).toBe(true);

    nock.restore();
  });

  it('should HTTP GET a URL string', async () => {
    setupNockScope();

    const response = await follow(urlString);

    expect(response.url).toBe(urlString);
    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toBe(responseBody);
  });

  it('should HTTP GET a URL', async () => {
    setupNockScope();

    const response = await follow(url);

    expect(response.url).toBe(urlString);
    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toBe(responseBody);
  });

  it('should HTTP GET a Hyperlink URL string', async () => {
    setupNockScope();

    const response = await follow({ href: urlString });

    expect(response.url).toBe(urlString);
    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toBe(responseBody);
  });

  it('should HTTP GET a Hyperlink URL', async () => {
    setupNockScope();

    const response = await follow({ href: url });

    expect(response.url).toBe(urlString);
    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toBe(responseBody);
  });

  it('should accept and send request options', async () => {
    const apiKey = 'foo-bar-baz';
    const headers = { 'Api-Key': apiKey };
    setupNockScope(headers);

    const response = await follow(url, { headers });

    expect(response.url).toBe(urlString);
    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toBe(responseBody);
  });
});
