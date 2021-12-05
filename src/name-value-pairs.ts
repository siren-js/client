import { Entry, EntryList } from './entry-list';

/**
 * Implementation of the algorithm to
 * [convert an entry list to a list of name-value pairs](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#converting-an-entry-list-to-a-list-of-name-value-pairs),
 * from the WHATWG's HTML standard.
 */
export function toNameValuePairs(entryList: EntryList): [string, string][] {
  return entryList.map(toNameValuePair);
}

function toNameValuePair(entry: Entry): [string, string] {
  const name = normalizeNewlines(entry.name);
  const value =
    typeof entry.value === 'string' ? entry.value : entry.value.name;
  return [name, normalizeNewlines(value)];
}

function normalizeNewlines(s: string): string {
  return s.replace(/(?<!\r)\n|\r(?!\n)/g, '\r\n');
}
