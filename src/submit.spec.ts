import nock from 'nock';

import { Action, Field } from './';
import { Serializer } from './serialize/serializer';
import { submit } from './submit';

describe('submit', () => {
  const baseUrl = 'https://api.example.com';
  const path = '/foo';
  const url = new URL(path, baseUrl).toString();

  beforeEach(() => {
    if (!nock.isActive()) {
      nock.activate();
    }
  });

  afterEach(() => {
    nock.restore();
  });

  const nameField = new Field<string>();
  nameField.name = 'name';
  nameField.value = 'Ron';

  const emailField = new Field<string>();
  emailField.name = 'email';
  emailField.type = 'email';
  emailField.value = 'ron@example.com';

  const action = new Action();
  action.name = 'do-something';
  action.href = url;

  const urlEncodedForm = `${nameField.name}=${nameField.value}&${emailField.name}=${encodeURIComponent(
    emailField.value
  )}`;

  it('should make HTTP GET request when method is missing', async () => {
    const scope = nock(baseUrl).get(path).reply(204);

    const response = await submit(action);

    expect(response.url).toBe(url);
    expect(response.status).toBe(204);
    expect(scope.isDone()).toBe(true);
  });

  it.each(['GET', 'DELETE'])('should serialize fields into the query string for %s', async (method) => {
    const action = new Action();
    action.name = 'do-something';
    action.href = url;
    action.method = method;
    action.fields = [nameField, emailField];
    const scope = nock(baseUrl).intercept(`${path}?${urlEncodedForm}`, method).reply(204);

    const response = await submit(action);

    expect(response.url).toBe(`${url}?${urlEncodedForm}`);
    expect(response.status).toBe(204);
    expect(scope.isDone()).toBe(true);
  });

  it.each(['POST', 'PUT', 'PATCH'])('should serialize fields into the request for %s', async (method) => {
    const action = new Action();
    action.name = 'post';
    action.href = url;
    action.method = method;
    action.fields = [nameField, emailField];
    const scope = nock(baseUrl).intercept(path, method, urlEncodedForm).reply(204);

    const response = await submit(action);

    expect(response.url).toBe(url);
    expect(response.status).toBe(204);
    expect(scope.isDone()).toBe(true);
  });

  it('should use custom serializer', async () => {
    const action = new Action();
    action.name = 'do-something';
    action.href = url;
    action.method = 'POST';
    action.fields = [nameField, emailField];
    const content = `
      <${action.name}>
        <${nameField.name}>${nameField.value}</${nameField.name}>
        <${emailField.name}>${emailField.value}</${emailField.name}>
      </${action.name}>
    `;
    const contentType = 'text/xml';
    const serializer: Serializer = () => Promise.resolve({ content, contentType });
    const scope = nock(baseUrl, { reqheaders: { 'Content-Type': contentType } })
      .post(path, content)
      .reply(204);

    const response = await submit(action, { serializer });

    expect(response.url).toBe(url);
    expect(response.status).toBe(204);
    expect(scope.isDone()).toBe(true);
  });

  describe('requestInit option', () => {
    const apiKey = 'foo-bar-baz';
    const headers = { 'Api-Key': apiKey };
    const action = new Action();
    action.name = 'foo';
    action.href = url;
    action.method = 'POST';
    action.fields = [nameField];

    it('should send custom headers', async () => {
      const scope = nock(baseUrl, { reqheaders: headers }).post(path).reply(204);

      const response = await submit(action, { requestInit: { headers } });

      expect(response.url).toBe(url);
      expect(response.status).toBe(204);
      expect(scope.isDone()).toBe(true);
    });

    it('should merge custom headers with base headers', async () => {
      const scope = nock(baseUrl, { reqheaders: headers }).post(path).reply(204);

      const response = await submit(action, { requestInit: { headers: Object.entries(headers) } });

      expect(response.url).toBe(url);
      expect(response.status).toBe(204);
      expect(scope.isDone()).toBe(true);
    });
  });

  it('should resolve relative URL', async () => {
    const action = new Action();
    action.name = 'do-something';
    action.href = path;
    const scope = nock(baseUrl).get(path).reply(204);

    const response = await submit(action, { baseUrl });

    expect(response.url).toBe(url);
    expect(response.status).toBe(204);
    expect(scope.isDone()).toBe(true);
  });
});
