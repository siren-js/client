import { Serialization } from './';
import { Entry } from './entry';
import { EntryList } from './entry-list';
import normalizeNewlines from './normalize-newlines';

const CRLF = '\r\n';

export async function toMultipartFormData(entryList: EntryList): Promise<Serialization> {
  const boundary = makeBoundaryString();
  const body = await toMultipartBody(entryList, boundary);
  return {
    body,
    mediaType: `multipart/form-data; boundary="${boundary}"`
  };
}

function makeBoundaryString() {
  const timestamp = Date.now().toString();
  const padding = Math.floor(Math.random() * 100000).toString();
  const boundary = `${timestamp}${padding}`;
  return `${'-'.repeat(50 - boundary.length)}${boundary}`;
}

async function toMultipartBody(entryList: EntryList, boundary: string): Promise<string> {
  const parts = await toParts(entryList);
  const boundaryLine = `--${boundary}${CRLF}`;
  return `${boundaryLine}${parts.join(boundaryLine)}--${boundary}--`;
}

function toParts(entryList: EntryList): Promise<string[]> {
  return Promise.all(entryList.map((entry) => toPart(normalize(entry))));
}

function normalize(entry: Entry): Entry {
  const name = normalizeNewlines(entry.name);
  const value = typeof entry.value === 'string' ? normalizeNewlines(entry.value) : entry.value;
  return new Entry(name, value);
}

async function toPart(entry: Entry): Promise<string> {
  const headerFields = headers(entry);
  const value = typeof entry.value === 'string' ? entry.value : await entry.value.text();
  return `${headerFields}${CRLF}${CRLF}${value}${CRLF}`;
}

function headers(entry: Entry): string {
  let result = `Content-Disposition: form-data; name="${escape(entry.name)}"`;
  if (typeof entry.value !== 'string') {
    result += `; filename="${escape(entry.value.name)}"`;
    result += CRLF;
    const mediaType = entry.value.type === '' ? 'application/octet-stream' : entry.value.type;
    result += `Content-Type: ${mediaType}`;
  }
  return result;
}

const escape = (s: string): string => s.replace(/\n/g, '%0A').replace(/\r/g, '%0D').replace(/"/g, '%22');
