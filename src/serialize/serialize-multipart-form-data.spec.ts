import { textFile } from '../../test/stubs';
import { NameValuePair } from './name-value-pair';
import { serializeMultipartFormData } from './serialize-multipart-form-data';

describe('serializeMultipartFormData', () => {
  it('should return FormData object', () => {
    const result = serializeMultipartFormData([]);

    expect(result).toBeInstanceOf(FormData);
  });

  it('should return empty FormData object given no name value pairs', () => {
    const result = serializeMultipartFormData([]) as FormData;

    expect([...result.keys()]).toHaveLength(0);
  });

  it('should include a param per name-value pair', () => {
    const nameValuePairs: NameValuePair[] = [
      ['foo', 'bar'],
      ['bar', '42']
    ];

    const result = serializeMultipartFormData(nameValuePairs);

    expect([...result.keys()]).toHaveLength(2);
    expect(result.get(nameValuePairs[0][0])).toBe(nameValuePairs[0][1]);
    expect(result.get(nameValuePairs[1][0])).toBe(nameValuePairs[1][1]);
  });

  it('should include each value for duplicate names', () => {
    const nameValuePairs: NameValuePair[] = [
      ['foo', 'bar'],
      ['foo', 'baz'],
      ['bar', '42']
    ];

    const result = serializeMultipartFormData(nameValuePairs);

    expect([...result.keys()]).toHaveLength(3);
    expect(result.getAll(nameValuePairs[0][0])).toEqual([nameValuePairs[0][1], nameValuePairs[1][1]]);
    expect(result.getAll(nameValuePairs[2][0])).toEqual([nameValuePairs[2][1]]);
  });

  it('should use file when value is a File object', () => {
    const nameValuePairs: NameValuePair[] = [['attachment', textFile]];

    const result = serializeMultipartFormData(nameValuePairs);

    expect([...result.keys()]).toHaveLength(1);
    expect(result.get(nameValuePairs[0][0])).toBe(textFile);
  });
});
