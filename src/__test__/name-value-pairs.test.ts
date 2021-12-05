import { File } from '@web-std/file';
import { Entry } from '../entry-list';
import { toNameValuePairs } from '../name-value-pairs';

describe('toNameValuePairs', () => {
  it('should convert string entries', () => {
    const entryList = [new Entry('foo', 'bar'), new Entry('bar', 'baz')];

    const result = toNameValuePairs(entryList);

    expect(result).toEqual([
      ['foo', 'bar'],
      ['bar', 'baz']
    ]);
  });

  it('should use file name as value', () => {
    const fileName = 'foo.txt';
    const entryList = [new Entry('foo', new File(['lorem ipsum'], fileName))];

    const result = toNameValuePairs(entryList);

    expect(result).toEqual([['foo', fileName]]);
  });

  it('should normalize newlines', () => {
    const raw = 'foo\rbar\nbaz\r\nqux';
    const entryList = [
      new Entry(raw, raw),
      new Entry('file', new File(['lorem ipsum'], raw))
    ];

    const result = toNameValuePairs(entryList);

    const sanitized = 'foo\r\nbar\r\nbaz\r\nqux';
    expect(result).toEqual([
      [sanitized, sanitized],
      ['file', sanitized]
    ]);
  });
});
