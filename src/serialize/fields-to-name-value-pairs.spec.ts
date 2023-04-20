import { textFile } from '../../test/stubs';
import { Field } from '../models/field';
import { fieldsToNameValuePairs } from './fields-to-name-value-pairs';
import { NameValuePair } from './name-value-pair';

describe('fieldsToNameValuePairs', () => {
  it('should use Field name and value as-is for text-based fields', () => {
    const fieldData: [string, string, string | number | boolean][] = [
      ['text', 'a', 'foo'],
      ['search', 'b', 'bar'],
      ['tel', 'c', '(111) 222-3333'],
      ['url', 'd', 'http://example.com'],
      ['email', 'e', 'foo@example.com'],
      ['password', 'f', 's3cr3t-p4ssw0rd'],
      ['number', 'g', 69420],
      ['color', 'h', '#696969'],
      ['radio', 'i', 'baz'],
      ['checkbox', 'j', true]
    ];
    const fields = fieldData.map(([type, name, value]) => {
      const field = new Field();
      field.type = type;
      field.name = name;
      field.value = value;
      return field;
    });

    const result = fieldsToNameValuePairs(fields);

    const expectedNameValuePairs = fieldData.map<NameValuePair>(([, name, value]) => [name, String(value)]);
    expect(result).toStrictEqual(expectedNameValuePairs);
  });

  it('should format date-time field when value is a Date', () => {
    const date = new Date('2023-01-01T00:00Z');
    const fieldTypeFormattedDatePairs = [
      ['date', '2023-01-01'],
      ['month', '2023-01'],
      ['week', '2022-W52'],
      ['time', '00:00:00.000Z'],
      ['date-time', '2023-01-01T00:00:00.000Z'],
      ['unknown', '2023-01-01T00:00:00.000Z']
    ];
    const fields = fieldTypeFormattedDatePairs.map(([type]) => {
      const field = new Field<Date>();
      field.name = type;
      field.type = type;
      field.value = date;
      return field;
    });

    const result = fieldsToNameValuePairs(fields);

    expect(result).toStrictEqual(fieldTypeFormattedDatePairs);
  });

  it('should generate a pair per element when value is an array', () => {
    const field = new Field<string[]>();
    field.name = 'email';
    field.value = ['foo@example.com', 'bar@example.com'];

    const result = fieldsToNameValuePairs([field]);

    expect(result).toStrictEqual([
      [field.name, field.value[0]],
      [field.name, field.value[1]]
    ]);
  });

  it('should support file fields', () => {
    // const jsonFile = new File(['{"foo":"bar"}'], 'foo.json', { type: 'application/json' });
    const fileField = new Field<File>();
    fileField.name = 'logo';
    fileField.type = 'file';
    fileField.value = textFile;
    // unable to test FileList since jsdom is missing the Drag and Drop API
    // https://github.com/jsdom/jsdom/issues/1568
    // const transferList = new DataTransfer();
    // transferList.items.add(textFile);
    // transferList.items.add(jsonFile);
    // const multiFileField = new Field<FileList>();
    // multiFileField.type = 'file';
    // multiFileField.name = 'files-to-upload';
    // multiFileField.value = transferList.files;

    const result = fieldsToNameValuePairs([fileField]);

    expect(result).toStrictEqual([
      [fileField.name, textFile]
      // [multiFileField.name, textFile],
      // [multiFileField.name, jsonFile]
    ]);
  });

  it('should ignore empty file field', () => {
    const fileField = new Field<File>();
    fileField.name = 'logo';
    fileField.type = 'file';

    const result = fieldsToNameValuePairs([fileField]);

    expect(result).toStrictEqual([]);
  });
});
