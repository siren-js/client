import { textFile } from '../../test/stubs';
import { NameValuePair } from './name-value-pair';
import { serializePlainText } from './serialize-plain-text';

describe('serializePlainText', () => {
  it('should return string', () => {
    const result = serializePlainText([]);

    expect(result).toEqual(expect.any(String));
  });

  it('should return empty string given no name value pairs', () => {
    const result = serializePlainText([]);

    expect(result).toBe('');
  });

  it('should join all pairs with an =, each separated by a CRLF', () => {
    const nameValuePairs: NameValuePair[] = [
      ['foo', 'bar'],
      ['bar', '42']
    ];

    const result = serializePlainText(nameValuePairs);

    expect(result).toBe('foo=bar\r\nbar=42\r\n');
  });

  it('should include each value for duplicate names', () => {
    const nameValuePairs: NameValuePair[] = [
      ['foo', 'bar'],
      ['foo', 'baz'],
      ['bar', '42']
    ];

    const result = serializePlainText(nameValuePairs);

    expect(result).toBe('foo=bar\r\nfoo=baz\r\nbar=42\r\n');
  });

  it("should use file's name when value is a File object", () => {
    const nameValuePairs: NameValuePair[] = [['attachment', textFile]];

    const result = serializePlainText(nameValuePairs) as URLSearchParams;

    expect(result).toBe(`${nameValuePairs[0][0]}=${textFile.name}\r\n`);
  });
});
