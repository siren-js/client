import { isDate } from 'class-validator';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import utc from 'dayjs/plugin/utc';

import { Field } from '../models/field';
import { NameValuePair } from './name-value-pair';

dayjs.extend(advancedFormat);
dayjs.extend(isoWeek);
dayjs.extend(utc);

const temporalFieldTypesToFormat = new Map<string, string>([
  ['date', 'YYYY-MM-DD'],
  ['month', 'YYYY-MM'],
  ['week', 'GGGG-[W]WW'],
  ['time', 'HH:mm:ss.SSS[Z]'],
  ['date-time', 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]']
]);

const dateTimeFieldTypes = new Set(temporalFieldTypesToFormat.keys());

function formatDate(type: string, value: Date): string {
  const formatString = temporalFieldTypesToFormat.get(type);
  return formatString == null ? value.toISOString() : dayjs.utc(value).format(formatString);
}

function fieldToValue(field: Field): string | File | (string | File)[] | undefined {
  const { type, value } = field;
  if (dateTimeFieldTypes.has(type) && isDate(value)) {
    return formatDate(type, value);
  } else if (type === 'checkbox' && !field.checked) {
    return undefined;
  } else if (type === 'file') {
    if (value instanceof File) return value;
    else if (value instanceof FileList) return [...value];
  } else if (Array.isArray(value)) {
    return value;
  } else {
    return String(value);
  }
}

/**
 * Converts `fields` into an array of `NameValuePair` objects suitable for HTTP submission.
 */
export function fieldsToNameValuePairs(fields: Field[]): NameValuePair[] {
  return fields.reduce((nameValuePairs, field) => {
    const value = fieldToValue(field);
    if (value != null) {
      if (Array.isArray(value)) {
        const flattenedPairs = value.map<NameValuePair>((v) => [field.name, v]);
        nameValuePairs.push(...flattenedPairs);
      } else {
        nameValuePairs.push([field.name, value]);
      }
    }
    return nameValuePairs;
  }, [] as NameValuePair[]);
}
