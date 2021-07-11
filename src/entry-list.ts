import { Action, Field } from '@siren-js/core';
import { isRecord, UnknownRecord } from '@siren-js/core/dist/util/type-guard';
import { File } from '@web-std/file';
import { Entry, EntryValue } from './entry';

export { Entry, EntryValue } from './entry';

export type EntryList = Entry[];

/**
 * Converts an `Action` to an `EntryList`. This is an implementation of the
 * algorithm for
 * [contructing the entry list](https://github.com/siren-js/spec-extensions#constructing-the-entry-list),
 * as defined in our Siren specification extensions.
 */
export function toEntryList(action: Pick<Action, 'fields'>): EntryList {
  if (!isArray(action.fields)) {
    return [];
  }
  const entryList: EntryList = [];
  for (const field of action.fields) {
    if (isSkippableField(field)) {
      continue;
    }
    switch (field.type) {
      case 'checkbox':
        appendCheckbox(entryList, field);
        break;
      case 'file':
        appendFileUpload(entryList, field);
        break;
      case 'radio':
        appendRadioButton(entryList, field);
        break;
      case 'select':
        appendSelect(entryList, field);
        break;
      default:
        appendEntry(entryList, field.name, coerceToString(field.value));
    }
  }
  return entryList;
}

const isArray: (x: unknown) => x is unknown[] = Array.isArray;

const isSkippableField = (field: Field): boolean =>
  field.name == null ||
  field.name === '' ||
  !!field.disabled ||
  field.type === 'image';

/**
 * Appends a [`checkbox` field](https://github.com/siren-js/spec-extensions#checkbox-fields)
 * to the given `entryList`, if it is
 * [checked](https://github.com/siren-js/spec-extensions#checked)
 * @see appendEntry
 */
function appendCheckbox(entryList: EntryList, field: Field): void {
  if (field.checked) {
    appendEntry(entryList, field.name, coerceToString(field.value, 'on'));
  }
}

/**
 * Implementation of the algorithm to
 * [append an entry](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#append-an-entry)
 * to `entryList` given a `name` and a `value`, as defined in the HTML standard.
 */
function appendEntry(
  entryList: EntryList,
  name: string,
  value: EntryValue
): void {
  name = convert(name);
  value = typeof value === 'string' ? convert(value) : value;
  entryList.push(new Entry(name, value));
}

/**
 * Converts a string into a [scalar string value](https://infra.spec.whatwg.org/#javascript-string-convert)
 */
const convert = (s: string): string => s.replace(/[\uD800-\uDFFF]/g, '\uFFFD');

const isBlob = (value: unknown): value is Blob =>
  isRecord(value) &&
  typeof value.size === 'number' &&
  typeof value.type === 'string' &&
  typeof value.arrayBuffer === 'function' &&
  typeof value.slice === 'function' &&
  typeof value.stream === 'function' &&
  typeof value.text === 'function';

const isFile = (value: unknown): value is File =>
  isRecord(value) &&
  typeof value.lastModified === 'number' &&
  typeof value.name === 'string' &&
  isBlob(value);

/**
 * Appends a [`file` field](https://github.com/siren-js/spec-extensions#file-fields)
 * to the given `entryList`
 * @see appendEntry
 */
function appendFileUpload(entryList: EntryList, field: Field): void {
  const { name, files } = field;
  if (isArray(files)) {
    const selectedFiles = files.filter(isFile);
    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => {
        appendEntry(entryList, name, file);
      });
    } else {
      appendEntry(entryList, name, emptyFile());
    }
  } else if (isFileList(files) && files.length > 0) {
    [...files].forEach((file) => {
      appendEntry(entryList, name, file);
    });
  } else {
    appendEntry(entryList, name, emptyFile());
  }
}

const emptyFile = () => new File([], '', { type: 'application/octet-stream' });

/**
 * Cross-platform type guard for `FileList`
 */
const isFileList = (value: unknown): value is FileList =>
  typeof FileList !== 'undefined' && value instanceof FileList;

/**
 * Appends the first [checked](https://github.com/siren-js/spec-extensions#checked-1)
 * [radio button](https://github.com/siren-js/spec-extensions#radio-object) of a
 * [`radio` field](https://github.com/siren-js/spec-extensions#radio-fields) to
 * the given `entryList`
 * @see appendEntry
 */
function appendRadioButton(entryList: EntryList, field: Field): void {
  if (isArray(field.group)) {
    const radio = <UnknownRecord | undefined>field.group.find(isCheckedRadio);
    if (radio !== undefined) {
      appendEntry(entryList, field.name, coerceToString(radio.value, 'on'));
    }
  }
}

const isCheckedRadio = (value: unknown): value is UnknownRecord =>
  isRecord(value) && !!value.checked;

/**
 * Appends all [selected](https://github.com/siren-js/spec-extensions#selected)
 * [`options`](https://github.com/siren-js/spec-extensions#options) of a
 * [`select` field](https://github.com/siren-js/spec-extensions#select-fields) to
 * the given `entryList`
 * @see appendEntry
 */
function appendSelect(entryList: EntryList, field: Field): void {
  if (isArray(field.options)) {
    field.options.forEach((option) => {
      if (isSelectedOption(option)) {
        appendEntry(
          entryList,
          field.name,
          coerceToString(option.value, option.title)
        );
      }
    });
  }
}

const isSelectedOption = (value: unknown): value is UnknownRecord =>
  isRecord(value) &&
  isPrimitive(value.title) &&
  !!value.selected &&
  !value.disabled;

const isPrimitive = (value: unknown): value is string | number | boolean =>
  ['string', 'number', 'boolean'].includes(typeof value);

const coerceToString = (value: unknown, defaultValue: unknown = '') =>
  String(value ?? defaultValue);
