import { Entry } from './entry';
import { EntryList } from './entry-list';
import normalizeNewlines from './normalize-newlines';

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
  const value = typeof entry.value === 'string' ? entry.value : entry.value.name;
  return [name, normalizeNewlines(value)];
}
