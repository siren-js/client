import { nameField } from '../../test/stubs';
import { NameValuePair } from '../types/name-value-pair';
import { defaultSerializer } from './default-serializer';
import { fieldsToNameValuePairs } from './fields-to-name-value-pairs';
import { serializeJson } from './serialize-json';
import { serializeMultipartFormData } from './serialize-multipart-form-data';
import { serializePlainText } from './serialize-plain-text';
import { serializeUrlEncodedForm } from './serialize-url-encoded-form';
import { UnsupportedSerializerTypeError } from './unsupported-serializer-type-error';

jest.mock('./fields-to-name-value-pairs');
jest.mock('./serialize-json');
jest.mock('./serialize-multipart-form-data');
jest.mock('./serialize-plain-text');
jest.mock('./serialize-url-encoded-form');

const mockedFieldsToNamedValuePairs = jest.mocked(fieldsToNameValuePairs);
const mockedSerializeJson = jest.mocked(serializeJson);
const mockedSerializeMultipartFormData = jest.mocked(serializeMultipartFormData);
const mockedSerializePlainText = jest.mocked(serializePlainText);
const mockedSerializeUrlEncodedForm = jest.mocked(serializeUrlEncodedForm);

describe('defaultSerializer', () => {
  const fields = [nameField];
  const nameValuePairs: NameValuePair[] = [[nameField.name, 'Neville']];

  beforeEach(() => {
    mockedFieldsToNamedValuePairs.mockReturnValueOnce(nameValuePairs);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should serialize application/json', async () => {
    const type = 'application/json';
    const content = JSON.stringify({ foo: 'bar' });
    mockedSerializeJson.mockReturnValueOnce(content);

    const result = await defaultSerializer(type, fields);

    expect(result).toEqual({ content, contentType: type });
    expect(mockedFieldsToNamedValuePairs).not.toHaveBeenCalled();
    expect(mockedSerializeJson).toHaveBeenCalledTimes(1);
    expect(mockedSerializeJson).toHaveBeenCalledWith(fields);
  });

  it('should serialize application/x-www-form-urlencoded', async () => {
    const type = 'application/x-www-form-urlencoded';
    const content = new URLSearchParams();
    mockedSerializeUrlEncodedForm.mockReturnValueOnce(content);

    const result = await defaultSerializer(type, fields);

    expect(result).toEqual({ content, contentType: type });
    expect(mockedFieldsToNamedValuePairs).toHaveBeenCalledTimes(1);
    expect(mockedFieldsToNamedValuePairs).toHaveBeenCalledWith(fields);
    expect(mockedSerializeUrlEncodedForm).toHaveBeenCalledTimes(1);
    expect(mockedSerializeUrlEncodedForm).toHaveBeenCalledWith(nameValuePairs);
  });

  it('should serialize multipart/form-data', async () => {
    const type = 'multipart/form-data';
    const content = new FormData();
    mockedSerializeMultipartFormData.mockReturnValueOnce(content);

    const result = await defaultSerializer(type, fields);

    expect(result).toEqual({ content, contentType: undefined });
    expect(mockedFieldsToNamedValuePairs).toHaveBeenCalledTimes(1);
    expect(mockedFieldsToNamedValuePairs).toHaveBeenCalledWith(fields);
    expect(mockedSerializeMultipartFormData).toHaveBeenCalledTimes(1);
    expect(mockedSerializeMultipartFormData).toHaveBeenCalledWith(nameValuePairs);
  });

  it('should serialize text/plain', async () => {
    const type = 'text/plain';
    const content = 'foo';
    mockedSerializePlainText.mockReturnValueOnce(content);

    const result = await defaultSerializer(type, fields);

    expect(result).toEqual({ content, contentType: type });
    expect(mockedFieldsToNamedValuePairs).toHaveBeenCalledTimes(1);
    expect(mockedFieldsToNamedValuePairs).toHaveBeenCalledWith(fields);
    expect(mockedSerializePlainText).toHaveBeenCalledTimes(1);
    expect(mockedSerializePlainText).toHaveBeenCalledWith(nameValuePairs);
  });

  it('should throw UnsupportedSerializerTypeError for other types', async () => {
    await expect(defaultSerializer('application/octet-stream', [])).rejects.toThrow(UnsupportedSerializerTypeError);
    await expect(defaultSerializer('application/xml', [])).rejects.toThrow(UnsupportedSerializerTypeError);
    await expect(defaultSerializer('text/xml', [])).rejects.toThrow(UnsupportedSerializerTypeError);
  });
});
