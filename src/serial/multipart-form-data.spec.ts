import { File } from '@web-std/file';
import { Entry, EntryList } from './entry-list';
import { toMultipartFormData } from './multipart-form-data';

const multipartMediaTypeRegExp = /^multipart\/form-data; boundary="(.*)"$/;

describe('toMultipartFormData', () => {
  it('should serialize', async () => {
    const entryList: EntryList = [
      new Entry('foo', 'bar'),
      new Entry('foo\r"bar"\nbaz', '"lorem\ripsum\ndolor"'),
      new Entry('docs', new File(['# README\r\nHello, multipart'], 'README.md', { type: 'text/markdown' })),
      new Entry('docs', new File(['Lorem ipsum dolor sit amet\r\n'], 'foo\r"bar"\nbaz.txt', { type: 'text/plain' })),
      new Entry('file3', new File(['default Content-Type'], 'default.txt'))
    ];

    const result = await toMultipartFormData(entryList);

    expect(result.mediaType).toMatch(multipartMediaTypeRegExp);
    const [, boundary] = multipartMediaTypeRegExp.exec(result.mediaType) ?? [];
    expect(result.body).toBe(
      `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="foo"\r\n` +
        '\r\n' +
        'bar\r\n' +
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="foo%0D%0A%22bar%22%0D%0Abaz"\r\n` +
        '\r\n' +
        '"lorem\r\n' +
        'ipsum\r\n' +
        'dolor"\r\n' +
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="docs"; filename="README.md"\r\n` +
        `Content-Type: text/markdown\r\n` +
        '\r\n' +
        '# README\r\n' +
        'Hello, multipart\r\n' +
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="docs"; filename="foo%0D%22bar%22%0Abaz.txt"\r\n` +
        `Content-Type: text/plain\r\n` +
        '\r\n' +
        'Lorem ipsum dolor sit amet\r\n' +
        '\r\n' +
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="file3"; filename="default.txt"\r\n` +
        `Content-Type: application/octet-stream\r\n` +
        '\r\n' +
        'default Content-Type\r\n' +
        `--${boundary}--`
    );
  });
});
