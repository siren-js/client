import { File } from '@web-std/file';

import { Entry } from './entry';
import { EntryList } from './entry-list';
import { toNameValuePairs } from './name-value-pairs';

describe('toNameValuePairs', () => {
  it('should convert string entries', () => {
    const entryList: EntryList = [
      new Entry('foo', 'bar'),
      new Entry('bar', 'baz'),
      new Entry('foo\rbar\nbaz', 'lorem\ripsum\ndolor')
    ];

    const result = toNameValuePairs(entryList);

    expect(result).toEqual([
      ['foo', 'bar'],
      ['bar', 'baz'],
      ['foo\r\nbar\r\nbaz', 'lorem\r\nipsum\r\ndolor']
    ]);
  });

  it('should use file name as value', () => {
    const fileName = 'foo.txt';
    const entryList: EntryList = [new Entry('foo', new File(['lorem ipsum'], fileName))];

    const result = toNameValuePairs(entryList);

    expect(result).toEqual([['foo', fileName]]);
  });
});
