import 'reflect-metadata';

import { textFile } from '../../test/stubs';
import { Field } from '../models';
import { serializeJson } from './serialize-json';

function field(name: string, value: unknown) {
  const f = new Field();
  f.name = name;
  f.value = value;
  return f;
}

describe('serializeJson', () => {
  it('should return empty object when given no fields', () => {
    const result = serializeJson([]);

    expect(result).toBe('{}');
  });

  it('should return object from field names and values', () => {
    const nameValues: [string, unknown][] = [
      ['foo', true],
      ['bar', 42],
      ['baz', 'foo'],
      ['qux', [1, 2, 3]],
      ['quz', { a: 1, b: 2 }]
    ];
    const fields = nameValues.map(([name, value]) => field(name, value));

    const result = serializeJson(fields);

    expect(result).toBe(JSON.stringify(Object.fromEntries(nameValues)));
  });

  it("should use file's name when value is a File object", () => {
    const field = new Field();
    field.name = 'test-file';
    field.value = textFile;

    const result = serializeJson([field]);

    expect(result).toBe(JSON.stringify({ [field.name]: textFile.name }));
  });
});
