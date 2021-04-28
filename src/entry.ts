import { Action, Field } from '@siren-js/core';
import { isRecord, UnknownRecord } from '@siren-js/core/dist/util/type-guard';

export default class Entry {
  #name: string;
  #value: string;

  constructor(name: string, value: string) {
    this.#name = name;
    this.#value = value;
  }

  get name(): string {
    return this.#name;
  }

  get value(): string {
    return this.#value;
  }
}

export type EntryList = Entry[];

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
      case 'radio':
        appendRadioButton(entryList, field);
        break;
      case 'checkbox':
        appendCheckbox(entryList, field);
        break;
      default:
        appendEntry(entryList, field.name, String(field.value));
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

function appendRadioButton(entryList: EntryList, field: Field): void {
  if (isArray(field.group)) {
    const radio = <UnknownRecord | undefined>field.group.find(isCheckedRadio);
    if (radio !== undefined) {
      appendEntry(entryList, field.name, String(radio.value ?? 'on'));
    }
  }
}

function isCheckedRadio(object: unknown): object is UnknownRecord {
  return isRecord(object) && !!object.checked;
}

function appendEntry(entryList: EntryList, name: string, value: string): void {
  entryList.push(new Entry(name, value));
}

function appendCheckbox(entryList: EntryList, field: Field): void {
  if (field.checked) {
    appendEntry(entryList, field.name, String(field.value ?? 'on'));
  }
}

export function toURLSearchParams(entryList: EntryList): URLSearchParams {
  const init = entryList.map(({ name, value }) => [name, value]);
  return new URLSearchParams(init);
}
