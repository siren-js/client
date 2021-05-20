/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action } from '@siren-js/core';
import { EntryList, toEntryList } from '../entry';

const toNameValuePairs = (entryList: EntryList): [string, string][] =>
  entryList.map(({ name, value }) => [name, value]);

describe('constructing the entry list', () => {
  it('should return empty list when fields is not an array', () => {
    [undefined, null, true, 42, 'foo', {}].forEach((value: any) => {
      expect(toEntryList({ fields: value })).toEqual([]);
    });
  });

  it('should convert fields to entry list', () => {
    const bio = `
      English half-blood wizard. One of the most famous wizards of modern times.
      Boy Who Lived. Chosen One. Auror.
    `;
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
        { name: 'bio', type: 'textarea', value: bio }
      ]
    });

    const entryList = toEntryList(action);

    expect(toNameValuePairs(entryList)).toEqual([
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
      ['bio', bio]
    ]);
  });

  it('should sanitize field names and values', () => {
    const cases: [string, string][] = [
      ['\nfoo\rbar\n\rbaz\r\n', '\r\nfoo\r\nbar\r\n\r\nbaz\r\n'],
      [
        '\uD7FF\uD800\uD801\uDFFE\uDFFF\uE000',
        '\uD7FF\uFFFD\uFFFD\uFFFD\uFFFD\uE000'
      ],
      ['\uD800\n\r\uDFFF', '\uFFFD\r\n\r\n\uFFFD']
    ];
    const action = new Action('foo', '/foo', {
      fields: cases.map(([s]) => ({ name: s, value: s }))
    });

    const entryList = toEntryList(action);

    expect(entryList).toHaveLength(cases.length);
    cases.forEach(([, expected], index) => {
      expect(entryList[index].name).toBe(expected);
      expect(entryList[index].value).toBe(expected);
    });
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

    expect(toNameValuePairs(entryList)).toEqual([
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

  it('should include first checked radio button', () => {
    const action = new Action('foo', '/foo', {
      fields: [
        {
          name: 'foo',
          type: 'radio',
          group: [
            { title: 'bar', value: 1, checked: true },
            { title: 'baz', value: 2, checked: true }
          ]
        }
      ]
    });

    const entryList = toEntryList(action);

    expect(entryList).toHaveLength(1);
    expect(entryList[0].value).toBe('1');
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

  describe('select fields', () => {
    it('should include all selected select options', () => {
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

      expect(toNameValuePairs(entryList)).toEqual([
        ['foo', 'foo'],
        ['foo', 'baz'],
        ['foo', 'qux']
      ]);
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

      expect(toNameValuePairs(entryList)).toEqual([
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

      expect(toNameValuePairs(entryList)).toEqual([
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
