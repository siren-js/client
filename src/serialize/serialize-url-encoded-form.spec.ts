import { textFile } from '../../test/stubs';
import { NameValuePair } from './name-value-pair';
import { serializeUrlEncodedForm } from './serialize-url-encoded-form';

describe('serializeUrlEncodedForm', () => {
  it('should return URLSearchParams object', () => {
    const result = serializeUrlEncodedForm([]);

    expect(result).toBeInstanceOf(URLSearchParams);
  });

  it('should return empty URLSearchParams object given no name value pairs', () => {
    const result = serializeUrlEncodedForm([]);

    expect([...result.keys()]).toHaveLength(0);
  });

  it('should include a param per name-value pair', () => {
    const nameValuePairs: NameValuePair[] = [
      ['foo', 'bar'],
      ['bar', '42']
    ];

    const result = serializeUrlEncodedForm(nameValuePairs);

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

    const result = serializeUrlEncodedForm(nameValuePairs);

    expect([...result.keys()]).toHaveLength(3);
    expect(result.getAll(nameValuePairs[0][0])).toEqual([nameValuePairs[0][1], nameValuePairs[1][1]]);
    expect(result.getAll(nameValuePairs[2][0])).toEqual([nameValuePairs[2][1]]);
  });

  it("should use file's name when value is a File object", () => {
    const nameValuePairs: NameValuePair[] = [['attachment', textFile]];

    const result = serializeUrlEncodedForm(nameValuePairs);

    expect([...result.keys()]).toHaveLength(1);
    expect(result.get(nameValuePairs[0][0])).toBe(textFile.name);
  });
});
