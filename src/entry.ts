import { Action, Field } from '@siren-js/core';
import { isRecord, UnknownRecord } from '@siren-js/core/dist/util/type-guard';
import { File } from 'web-file-polyfill';

/**
 * Represents an [entry](https://xhr.spec.whatwg.org/#concept-formdata-entry) as
 * defined in WHATWG's XMLHttpRequest standard.
 */
export class Entry {
  #name: string;
  #value: EntryValue;

  /**
   * Implementation of a subset of the XMLHttpRequest standard's algorithm to
   * [create an entry](https://xhr.spec.whatwg.org/#create-an-entry). Namely,
   * `Blob` values and the optional `filename` parameter aren't currently
   * supported.
   */
  constructor(name: string, value: EntryValue) {
    this.#name = name;
    this.#value = value;
  }

  get name(): string {
    return this.#name;
  }

  get value(): EntryValue {
    return this.#value;
  }
}

export type EntryValue = File | string;

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
      case 'textarea':
        appendTextArea(entryList, field);
        break;
      default:
        appendEntry(entryList, field.name, coerceValue(field));
    }
  }
  return entryList;
}

const isArray: (x: unknown) => x is unknown[] = Array.isArray;

function isSkippableField(field: Field): boolean {
  return (
    field.name == null ||
    field.name === '' ||
    !!field.disabled ||
    field.type === 'image'
  );
}

function appendCheckbox(entryList: EntryList, field: Field): void {
  if (field.checked) {
    appendEntry(entryList, field.name, String(field.value ?? 'on'));
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

const isFileList = (value: unknown): value is FileList =>
  typeof FileList !== 'undefined' && value instanceof FileList;

function appendRadioButton(entryList: EntryList, field: Field): void {
  if (isArray(field.group)) {
    const radio = <UnknownRecord | undefined>field.group.find(isCheckedRadio);
    if (radio !== undefined) {
      appendEntry(entryList, field.name, String(radio.value ?? 'on'));
    }
  }
}

const isCheckedRadio = (value: unknown): value is UnknownRecord =>
  isRecord(value) && !!value.checked;

function appendSelect(entryList: EntryList, field: Field): void {
  if (isArray(field.options)) {
    field.options.forEach((option) => {
      if (isSelectedOption(option)) {
        appendEntry(
          entryList,
          field.name,
          String(option.value ?? option.title)
        );
      }
    });
  }
}

const isSelectedOption = (value: unknown): value is UnknownRecord =>
  isRecord(value) && isPrimitive(value.title) && !!value.selected;

const isPrimitive = (value: unknown): value is string | number | boolean =>
  ['string', 'number', 'boolean'].includes(typeof value);

function appendTextArea(entryList: EntryList, field: Field) {
  const value = normalizeNewlines(coerceValue(field));
  appendEntry(entryList, field.name, value);
}

const coerceValue = (field: Field) => String(field.value ?? '');

/**
 * Normalizes the newlines of a string as defined in WHATWG's
 * [Infra standard](https://infra.spec.whatwg.org)
 */
const normalizeNewlines = (s: string): string =>
  s.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

/**
 * Implementation of the
 * [`application/x-www-form-urlencoded` serializer](https://url.spec.whatwg.org/#concept-urlencoded-serializer),
 * from the WHATWG's URL standard.
 */
export function toURLSearchParams(entryList: EntryList): URLSearchParams {
  const init = entryList.map(({ name, value }) => [
    name,
    typeof value === 'string' ? value : value.name
  ]);
  return new URLSearchParams(init);
}
