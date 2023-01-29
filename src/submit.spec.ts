import '../test/setup';

import nock from 'nock';

import { Action } from './models/action';
import { Field } from './models/field';
import { Serializer } from './serialize/serializer';
import { submit } from './submit';

describe('submit', () => {
  const baseUrl = new URL('https://api.example.com').toString();
  const path = '/foo';
  const url = new URL(path, baseUrl).toString();
  const responseBody = 'Success!';

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

  const getAction = new Action();
  getAction.name = 'get';
  getAction.href = url;

  const postAction = new Action();
  postAction.name = 'post';
  postAction.href = url;
  postAction.method = 'POST';
  postAction.fields = [nameField, emailField];

  const urlEncodedForm = `${nameField.name}=${nameField.value}&${emailField.name}=${encodeURIComponent(
    emailField.value!
  )}`;

  it('should make HTTP GET request when method is missing', async () => {
    const scope = nock(baseUrl).get(path).reply(200, responseBody);

    const response = await submit(getAction);

    expect(response.url).toBe(url);
    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toBe(responseBody);
    expect(scope.isDone()).toBe(true);
  });

  it('should serialize fields into the query string for non-content-supporting HTTP method', async () => {
    const getAction = new Action();
    getAction.name = 'get';
    getAction.href = url;
    getAction.fields = [nameField, emailField];
    const scope = nock(baseUrl).get(`${path}?${urlEncodedForm}`).reply(200, responseBody);

    const response = await submit(getAction);

    expect(response.url).toBe(`${url}?${urlEncodedForm}`);
    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toBe(responseBody);
    expect(scope.isDone()).toBe(true);
  });

  it('should serialize fields into the request for content-supporting HTTP method', async () => {
    const scope = nock(baseUrl).post(path, urlEncodedForm).reply(200, responseBody);

    const response = await submit(postAction);

    expect(response.url).toBe(url);
    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toBe(responseBody);
    expect(scope.isDone()).toBe(true);
  });

  it('should use custom serializer', async () => {
    const content = `
      <${getAction.name}>
        <${nameField.name}>${nameField.value}</${nameField.name}>
        <${emailField.name}>${emailField.value}</${emailField.name}>
      </${getAction.name}>
    `;
    const contentType = 'text/xml';
    const serializer: Serializer = () => Promise.resolve({ content, contentType });
    const scope = nock(baseUrl, { reqheaders: { 'Content-Type': contentType } })
      .post(path, content)
      .reply(200, responseBody);

    const response = await submit(postAction, { serializer });

    expect(response.url).toBe(url);
    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toBe(responseBody);
    expect(scope.isDone()).toBe(true);
  });
});
