/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action } from '@siren-js/core';
import { File } from '@web-std/file';
import { EntryList, EntryValue, toEntryList } from '../entry-list';

const toRawPairs = (entryList: EntryList): [string, EntryValue][] =>
  entryList.map(({ name, value }) => [name, value]);

describe('constructing the entry list', () => {
  it('should return empty list when fields is not an array', () => {
    [undefined, null, true, 42, 'foo', {}].forEach((value: any) => {
      expect(toEntryList({ fields: value })).toEqual([]);
    });
  });

  it('should use value for text-based field types', () => {
    const bio = `
      English half-blood wizard. One of the most famous wizards of modern times.
      Boy Who Lived. Chosen One. Auror.
    `;
    const file = new File(['foobar'], 'avatar.png', { type: 'image/png' });
    const action = new Action('create-account', '/kitchen-sink', {
      fields: [
        { name: 'source', type: 'hidden', value: 'mobile' },
        { name: 'fullName', type: 'text', value: 'Harry Potter' },
        { name: 'quest', type: 'search', value: 'destroy the horcruxes' },
        { name: 'phone', type: 'tel', value: '+44 7700 900077' },
        {
          name: 'website',
          type: 'url',
          value: 'https://harrypotter.fandom.com/wiki/Harry_Potter'
        },
        { name: 'email', type: 'email', value: 'harry@potter.uk' },
        { name: 'password', type: 'password', value: 'v0ldemort$tinks' },
        { name: 'birthDate', type: 'date', value: '1980-07-31' },
        { name: 'birthMonth', type: 'week', value: '1980-07' },
        { name: 'birthWeek', type: 'week', value: '1980-W31' },
        { name: 'birthTime', type: 'time', value: '12:34:56.789' },
        {
          name: 'birthDateTime',
          type: 'datetime-local',
          value: '1980-07-31T12:34:56.789'
        },
        { name: 'favoriteNumber', type: 'number', value: 42 },
        { name: 'randomNumber', type: 'range', value: 69 },
        { name: 'favoriteColor', type: 'color', value: '#740001' },
        { name: 'wizard', type: 'checkbox', value: 'yes', checked: true },
        {
          name: 'hogwartsHouse',
          type: 'radio',
          group: [
            { title: 'Gryffindor', value: 'gryffindor', checked: true },
            { title: 'Hufflepuff', value: 'hufflepuff' },
            { title: 'Ravenclaw', value: 'ravenclaw' },
            { title: 'Slytherin', value: 'slytherin' }
          ]
        },
        {
          name: 'bloodStatus',
          type: 'select',
          options: [
            { title: 'Muggle-born', value: 'muggle-born' },
            { title: 'Half-blood', value: 'half-blood', selected: true },
            { title: 'Pure-blood', value: 'pure-blood' },
            { title: 'Squib', value: 'squib' },
            { title: 'Half-breed', value: 'half-breed' }
          ]
        },
        { name: 'bio', type: 'textarea', value: bio },
        { name: 'avatar', type: 'file', files: [file] }
      ]
    });

    const entryList = toEntryList(action);

    expect(toRawPairs(entryList)).toEqual([
      ['source', 'mobile'],
      ['fullName', 'Harry Potter'],
      ['quest', 'destroy the horcruxes'],
      ['phone', '+44 7700 900077'],
      ['website', 'https://harrypotter.fandom.com/wiki/Harry_Potter'],
      ['email', 'harry@potter.uk'],
      ['password', 'v0ldemort$tinks'],
      ['birthDate', '1980-07-31'],
      ['birthMonth', '1980-07'],
      ['birthWeek', '1980-W31'],
      ['birthTime', '12:34:56.789'],
      ['birthDateTime', '1980-07-31T12:34:56.789'],
      ['favoriteNumber', '42'],
      ['randomNumber', '69'],
      ['favoriteColor', '#740001'],
      ['wizard', 'yes'],
      ['hogwartsHouse', 'gryffindor'],
      ['bloodStatus', 'half-blood'],
      ['bio', bio],
      ['avatar', file]
    ]);
  });

  it('should create entry for first checked radio button', () => {
    const action = new Action('foo', '/foo', {
      fields: [
        {
          name: 'foo',
          type: 'radio',
          group: [
            { title: 'bar', value: 1, checked: true },
            { title: 'baz', value: 2 }
          ]
        },
        {
          name: 'bar',
          type: 'radio',
          group: [
            { title: 'foo', value: 0, checked: true },
            { title: 'baz', value: 2, checked: true }
          ]
        }
      ]
    });

    const entryList = toEntryList(action);

    expect(entryList).toHaveLength(2);
    expect(entryList[0].name).toBe('foo');
    expect(entryList[0].value).toBe('1');
    expect(entryList[1].name).toBe('bar');
    expect(entryList[1].value).toBe('0');
  });

  it('should covert field names and values to scalar value strings', () => {
    const nonScalar = '\uD7FE\uD7FF\uD800\uD801\uDFFE\uDFFF\uE000\uE001';
    const action = new Action('foo', '/foo', {
      fields: [{ name: nonScalar, value: nonScalar }]
    });

    const entryList = toEntryList(action);

    const scalar = '\uD7FE\uD7FF\uFFFD\uFFFD\uFFFD\uFFFD\uE000\uE001';
    expect(entryList).toHaveLength(1);
    expect(entryList[0].name).toBe(scalar);
    expect(entryList[0].value).toBe(scalar);
  });

  it('should default value when undefined', () => {
    const action = new Action('create-account', '/kitchen-sink', {
      fields: [
        { name: 'source', type: 'hidden' },
        { name: 'fullName', type: 'text' },
        { name: 'quest', type: 'search' },
        { name: 'phone', type: 'tel' },
        { name: 'website', type: 'url' },
        { name: 'email', type: 'email' },
        { name: 'password', type: 'password' },
        { name: 'birthDate', type: 'date' },
        { name: 'birthMonth', type: 'week' },
        { name: 'birthWeek', type: 'week' },
        { name: 'birthTime', type: 'time' },
        { name: 'birthDateTime', type: 'datetime-local' },
        { name: 'favoriteNumber', type: 'number' },
        { name: 'randomNumber', type: 'range' },
        { name: 'favoriteColor', type: 'color' }
      ]
    });

    const entryList = toEntryList(action);

    expect(toRawPairs(entryList)).toEqual([
      ['source', ''],
      ['fullName', ''],
      ['quest', ''],
      ['phone', ''],
      ['website', ''],
      ['email', ''],
      ['password', ''],
      ['birthDate', ''],
      ['birthMonth', ''],
      ['birthWeek', ''],
      ['birthTime', ''],
      ['birthDateTime', ''],
      ['favoriteNumber', ''],
      ['randomNumber', ''],
      ['favoriteColor', '']
    ]);
  });

  it('should ignore skippable fields', () => {
    const action = {
      fields: [
        { value: 'foo' },
        { name: '', value: 'foo' },
        { name: 'foo', disabled: true },
        { name: 'bar', type: 'image' }
      ]
    };

    const entryList = toEntryList(<any>action);

    expect(entryList).toEqual([]);
  });

  it('should default checkbox and radio button value to on', () => {
    const action = new Action('foo', '/foo', {
      fields: [
        { name: 'foo', type: 'checkbox', checked: true },
        { name: 'bar', type: 'radio', group: [{ checked: true }] }
      ]
    });

    const entryList = toEntryList(action);

    expect(entryList).toHaveLength(2);
    expect(entryList[0].value).toBe('on');
    expect(entryList[1].value).toBe('on');
  });

  it('should not add entry for unchecked checkboxes and radio buttons', () => {
    const action = new Action('foo', '/foo', {
      fields: [
        { name: 'foo', type: 'checkbox' },
        {
          name: 'bar',
          type: 'radio',
          group: [
            { title: 'baz', value: 1 },
            { title: 'qux', value: 2 }
          ]
        }
      ]
    });

    const entryList = toEntryList(action);

    expect(entryList).toEqual([]);
  });

  it('should ignore radio button with invalid or missing group', () => {
    const action = new Action('foo', '/foo', {
      fields: [
        { name: 'foo', type: 'radio' },
        { name: 'bar', type: 'radio', group: { foo: 'bar' } }
      ]
    });

    const entryList = toEntryList(action);

    expect(entryList).toEqual([]);
  });

  describe('file fields', () => {
    it('should add entry for each file', () => {
      const files = [
        new File(['foo'], 'foo.txt', { type: 'text/plain' }),
        new File(['"foo"'], 'foo.json', { type: 'application/json' })
      ];
      const action = new Action('foo', '/foo', {
        fields: [{ name: 'foo', type: 'file', multiple: true, files }]
      });

      const entryList = toEntryList(action);

      expect(toRawPairs(entryList)).toEqual(files.map((file) => ['foo', file]));
    });

    it('should add empty file when files is empty, missing, or invalid', async () => {
      const action = new Action('foo', '/foo', {
        fields: [
          { name: 'foo', type: 'file', files: [] },
          { name: 'bar', type: 'file' },
          { name: 'baz', type: 'file', files: {} }
        ]
      });

      const entryList = toEntryList(action);

      expect(entryList).toHaveLength(3);
      for (const { value } of entryList) {
        expect(value).toBeInstanceOf(File);
        expect((<File>value).name).toBe('');
        expect((<File>value).type).toBe('application/octet-stream');
        await expect((<File>value).text()).resolves.toBe('');
      }
    });
  });

  describe('select fields', () => {
    it('should create entry for each selected select options', () => {
      const action = new Action('foo', '/foo', {
        fields: [
          {
            name: 'foo',
            type: 'select',
            multiple: true,
            options: [
              { title: 'Foo', value: 'foo', selected: true },
              { title: 'Bar', value: 'bar' },
              { title: 'Baz', value: 'baz', selected: true },
              { title: 'Qux', value: 'qux', selected: true }
            ]
          }
        ]
      });

      const entryList = toEntryList(action);

      expect(toRawPairs(entryList)).toEqual([
        ['foo', 'foo'],
        ['foo', 'baz'],
        ['foo', 'qux']
      ]);
    });

    it('should ignore disabled options', () => {
      const action = new Action('foo', '/foo', {
        fields: [
          {
            name: 'foo',
            type: 'select',
            multiple: true,
            options: [
              { title: 'Foo', value: 'foo', disabled: true, selected: true },
              { title: 'Bar', value: 'bar', disabled: true },
              { title: 'Baz', value: 'baz', selected: true },
              { title: 'Qux', value: 'qux' }
            ]
          }
        ]
      });

      const entryList = toEntryList(action);

      expect(entryList).toHaveLength(1);
      expect(entryList[0].name).toBe('foo');
      expect(entryList[0].value).toBe('baz');
    });

    it('should use option title if option value is missing', () => {
      const action = new Action('foo', '/foo', {
        fields: [
          {
            name: 'foo',
            type: 'select',
            options: [
              { title: 'Foo', selected: true },
              { title: 'Bar', selected: true }
            ]
          }
        ]
      });

      const entryList = toEntryList(action);

      expect(toRawPairs(entryList)).toEqual([
        ['foo', 'Foo'],
        ['foo', 'Bar']
      ]);
    });

    it('should skip options without title and value', () => {
      const action = new Action('foo', '/foo', {
        fields: [
          {
            name: 'foo',
            type: 'select',
            options: [
              { title: 'Foo', value: 'foo', selected: true },
              { title: 'Bar', selected: true },
              { selected: true }
            ]
          }
        ]
      });

      const entryList = toEntryList(action);

      expect(toRawPairs(entryList)).toEqual([
        ['foo', 'foo'],
        ['foo', 'Bar']
      ]);
    });

    it('should exclude field when no options selected', () => {
      const action = new Action('foo', '/foo', {
        fields: [
          {
            name: 'foo',
            type: 'select',
            options: [
              { title: 'Foo', value: 'foo' },
              { title: 'Bar', value: 'bar' }
            ]
          }
        ]
      });

      const entryList = toEntryList(action);

      expect(entryList).toEqual([]);
    });

    it('should ignore select with invalid or missing options', () => {
      const action = new Action('foo', '/foo', {
        fields: [
          { name: 'foo', type: 'select' },
          { name: 'bar', type: 'select', options: {} }
        ]
      });

      const entryList = toEntryList(action);

      expect(entryList).toEqual([]);
    });
  });
});
